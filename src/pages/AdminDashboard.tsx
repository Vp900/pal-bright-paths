import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCmsContent } from "@/hooks/useCms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, Save, Trash2, Upload, Plus, Loader2, Image as ImageIcon,
  FileText, Home, Info, BookOpen, Award, GalleryHorizontal, Phone,
  GraduationCap, Settings, Check, X, Edit2, ChevronDown, ChevronRight,
  Eye, EyeOff, RefreshCw
} from "lucide-react";
import { cmsPages, type CmsSection, type CmsField, type CmsImageField } from "@/config/cmsConfig";
import logoImg from "@/assets/logo.jpeg";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  Settings, Home, Info, BookOpen, Award, GalleryHorizontal, Phone, GraduationCap,
};

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");
  const cms = useCmsContent(activePage);
  const globalCms = useCmsContent("global");
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageUpload, setPendingImageUpload] = useState<{ key: string; page: string } | null>(null);

  // Draft state for fields
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const activeCms = activePage === "global" ? globalCms : cms;
  const pageConfig = cmsPages.find(p => p.id === activePage);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    setDrafts({});
    // Expand first section by default
    if (pageConfig?.sections?.[0]) {
      setExpandedSections({ [pageConfig.sections[0].id]: true });
    }
  }, [activePage]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getDraftOrValue = (key: string, fallback: string = "") => {
    if (drafts[key] !== undefined) return drafts[key];
    return activeCms.getContent(key, fallback);
  };

  const setDraft = (key: string, value: string) => {
    setDrafts(prev => ({ ...prev, [key]: value }));
  };

  const saveField = async (key: string, type: string = "text") => {
    if (drafts[key] === undefined) return;
    setSaving(true);
    await activeCms.upsertContent(key, drafts[key], type, activePage);
    setDrafts(prev => { const n = { ...prev }; delete n[key]; return n; });
    setSaving(false);
    toast.success("Saved!");
  };

  const saveAllDrafts = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(drafts)) {
      await activeCms.upsertContent(key, value, "text", activePage);
    }
    setDrafts({});
    setSaving(false);
    toast.success("All changes saved!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingImageUpload) return;
    setSaving(true);
    const path = `${pendingImageUpload.page}/${Date.now()}-${file.name}`;
    const { url, error } = activeCms.uploadImage
      ? await activeCms.uploadImage(file, path)
      : { url: null, error: "No upload fn" };
    if (url) {
      await activeCms.upsertImage(pendingImageUpload.key, url, pendingImageUpload.page);
      toast.success("Image uploaded!");
    } else {
      toast.error("Upload failed");
    }
    setPendingImageUpload(null);
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startImageUpload = (key: string) => {
    setPendingImageUpload({ key, page: activePage });
    fileInputRef.current?.click();
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Delete this image?")) {
      await activeCms.deleteImage(id);
      toast.success("Image deleted");
    }
  };

  // List item management
  const getListItemCount = (prefix: string): number => {
    let count = 0;
    for (let i = 0; i < 50; i++) {
      const exists = activeCms.content.find(c => c.section_key.startsWith(`${prefix}_${i}_`));
      if (!exists && drafts[`${prefix}_${i}_`] === undefined) {
        // Also check drafts
        const hasDraft = Object.keys(drafts).some(k => k.startsWith(`${prefix}_${i}_`));
        if (!hasDraft) break;
      }
      count++;
    }
    return count;
  };

  const addListItem = async (section: CmsSection) => {
    if (!section.listKey || !section.listItem) return;
    const count = getListItemCount(section.listKey);
    setSaving(true);
    for (const field of section.listItem.fields) {
      await activeCms.upsertContent(`${section.listKey}_${count}_${field.key}`, field.placeholder || "", "text", activePage);
    }
    setSaving(false);
    toast.success("Item added!");
  };

  const deleteListItem = async (section: CmsSection, index: number) => {
    if (!section.listKey || !confirm("Delete this item?")) return;
    setSaving(true);
    const prefix = `${section.listKey}_${index}_`;
    const toDelete = activeCms.content.filter(c => c.section_key.startsWith(prefix));
    for (const item of toDelete) {
      await activeCms.deleteContent(item.id);
    }
    // Also delete images
    const imgToDelete = activeCms.images.filter(i => i.section_key.startsWith(prefix));
    for (const img of imgToDelete) {
      await activeCms.deleteImage(img.id);
    }
    // Re-index remaining items
    const totalCount = getListItemCount(section.listKey!);
    // Simple approach: just refresh
    await activeCms.fetchContent();
    setSaving(false);
    toast.success("Item deleted");
  };

  const renderField = (field: CmsField, keyPrefix: string = "") => {
    const fullKey = keyPrefix ? `${keyPrefix}_${field.key}` : field.key;
    const value = getDraftOrValue(fullKey, field.placeholder || "");
    const isDirty = drafts[fullKey] !== undefined;

    return (
      <div key={fullKey} className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</label>
        <div className="flex gap-2">
          {field.type === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) => setDraft(fullKey, e.target.value)}
              placeholder={field.placeholder}
              className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setDraft(fullKey, e.target.value)}
              placeholder={field.placeholder}
              type={field.type === "number" ? "number" : "text"}
              className="flex-1"
            />
          )}
          {isDirty && (
            <Button size="icon" onClick={() => saveField(fullKey)} disabled={saving} className="shrink-0">
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderImageField = (imgField: CmsImageField, keyPrefix: string = "") => {
    const fullKey = keyPrefix ? `${keyPrefix}_${imgField.key}` : imgField.key;
    const currentImg = activeCms.images.find(i => i.section_key === fullKey);

    return (
      <div key={fullKey} className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{imgField.label}</label>
        <div className="border rounded-xl overflow-hidden bg-muted/30">
          {currentImg ? (
            <div className="relative group">
              <img src={currentImg.image_url} alt={imgField.label} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="secondary" onClick={() => startImageUpload(fullKey)}>
                  <Upload className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDeleteImage(currentImg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => startImageUpload(fullKey)}
              className="w-full h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs">Upload {imgField.label}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (section: CmsSection) => {
    const isExpanded = expandedSections[section.id] ?? false;

    return (
      <div key={section.id} className="bg-card border rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-sm">{section.label}</h3>
            {section.listKey && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {getListItemCount(section.listKey)} items
              </span>
            )}
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t pt-4">
            {/* Regular fields */}
            {section.fields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map(f => renderField(f))}
              </div>
            )}

            {/* Section-level images */}
            {section.images && section.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.images.map(img => renderImageField(img))}
              </div>
            )}

            {/* List items */}
            {section.listKey && section.listItem && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">{section.listLabel}s</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addListItem(section)}
                    disabled={saving || (section.maxItems ? getListItemCount(section.listKey!) >= section.maxItems : false)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add {section.listLabel}
                  </Button>
                </div>

                {Array.from({ length: getListItemCount(section.listKey) }).map((_, i) => (
                  <div key={i} className="bg-muted/30 border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteListItem(section, i)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.listItem!.fields.map(f => renderField(f, `${section.listKey}_${i}`))}
                    </div>
                    {section.listItem!.images && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.listItem!.images.map(img => renderImageField(img, `${section.listKey}_${i}`))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasDirtyFields = Object.keys(drafts).length > 0;

  return (
    <div className="min-h-screen bg-background flex">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
          <div>
            <p className="font-heading font-bold text-sm">Pal Classes</p>
            <p className="text-[10px] text-muted-foreground">Admin CMS</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {cmsPages.map((p) => {
            const Icon = ICON_MAP[p.icon] || FileText;
            return (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activePage === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {p.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold">{pageConfig?.label || activePage} Page</h1>
              <p className="text-muted-foreground text-sm">Manage all sections, text, and images</p>
            </div>
            <div className="flex gap-2">
              {hasDirtyFields && (
                <Button onClick={saveAllDrafts} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save All ({Object.keys(drafts).length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={activeCms.fetchContent}>
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>

          {activeCms.loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {pageConfig?.sections.map(section => renderSection(section))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
