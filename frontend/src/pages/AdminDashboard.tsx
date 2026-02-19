import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCmsContent } from "@/hooks/useCms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, Save, Trash2, Upload, Plus, Loader2,
  FileText, Home, Info, BookOpen, Award, GalleryHorizontal, Phone,
  GraduationCap, Settings, Check, ChevronDown, ChevronRight, RefreshCw, Menu, X, User
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
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New State for Enquiries/Contacts
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({ email: "", password: "", confirmPassword: "" });

  const activeCms = activePage === "global" ? globalCms : cms;
  const pageConfig = cmsPages.find(p => p.id === activePage);
  const isCmsPage = cmsPages.some(p => p.id === activePage);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user?.email) {
      setProfileData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    setDrafts({});
    if (pageConfig?.sections?.[0]) {
      setExpandedSections({ [pageConfig.sections[0].id]: true });
    }
    setSidebarOpen(false);

    if (activePage === "enquiries") fetchEnquiries();
    if (activePage === "contacts") fetchContacts();
  }, [activePage]);

  const fetchEnquiries = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/enquiry`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (e) {
      toast.error("Failed to load enquiries");
    }
    setDataLoading(false);
  };

  const fetchContacts = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setContacts(await res.json());
    } catch (e) {
      toast.error("Failed to load messages");
    }
    setDataLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          email: profileData.email,
          password: profileData.password || undefined
        }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
        setProfileData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

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

  const saveField = async (key: string) => {
    if (drafts[key] === undefined) return;
    setSaving(true);
    await activeCms.upsertContent(key, drafts[key], "text", activePage);
    setDrafts(prev => { const n = { ...prev }; delete n[key]; return n; });
    setSaving(false);
    toast.success("Saved!");
  };

  const saveAllDrafts = async () => {
    if (Object.keys(drafts).length === 0) return;
    setSaving(true);
    const items = Object.entries(drafts).map(([key, value]) => ({
      key, value, type: "text", page: activePage,
    }));
    const { error } = await activeCms.batchUpsertContent(items);
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      setDrafts({});
      toast.success("All changes saved!");
    }
    setSaving(false);
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

  const getListItemCount = (prefix: string): number => {
    let count = 0;
    for (let i = 0; i < 50; i++) {
      const exists = activeCms.content.find(c => c.section_key.startsWith(`${prefix}_${i}_`));
      if (!exists && !Object.keys(drafts).some(k => k.startsWith(`${prefix}_${i}_`))) break;
      count++;
    }
    return count;
  };

  const addListItem = async (section: CmsSection) => {
    if (!section.listKey || !section.listItem) return;
    const count = getListItemCount(section.listKey);
    setSaving(true);
    const items = section.listItem.fields.map(field => ({
      key: `${section.listKey}_${count}_${field.key}`,
      value: field.placeholder || "",
      type: "text",
      page: activePage,
    }));
    await activeCms.batchUpsertContent(items);
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
    const imgToDelete = activeCms.images.filter(i => i.section_key.startsWith(prefix));
    for (const img of imgToDelete) {
      await activeCms.deleteImage(img.id);
    }
    await activeCms.fetchContent();
    setSaving(false);
    toast.success("Item deleted");
  };

  const renderEnquiries = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">Enquiries</h2>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {enquiries.map((enq) => (
            <div key={enq._id || enq.id} className="bg-card p-4 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{enq.name}</h3>
                  <p className="text-sm text-muted-foreground">{enq.email} | {enq.phone}</p>
                  <p className="text-xs text-muted-foreground mt-1">Class: {enq.class || "N/A"}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${enq.type === 'demo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {enq.type || 'General'}
                </span>
              </div>
              <p className="mt-2 text-sm">{enq.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(enq.date).toLocaleDateString()}</p>
            </div>
          ))}
          {enquiries.length === 0 && <p>No enquiries found.</p>}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">Contact Messages</h2>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact._id || contact.id} className="bg-card p-4 rounded-xl border">
              <h3 className="font-semibold">{contact.subject}</h3>
              <p className="text-sm text-muted-foreground">{contact.name} ({contact.email})</p>
              <p className="mt-2 text-sm whitespace-pre-wrap">{contact.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(contact.date).toLocaleDateString()}</p>
            </div>
          ))}
          {contacts.length === 0 && <p>No messages found.</p>}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold font-heading">My Profile</h2>
      <div className="bg-card p-6 rounded-xl border space-y-4">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              value={profileData.email}
              onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                <Input value="********" disabled className="bg-muted" />
                <p className="text-[10px] text-muted-foreground">Security: Current password is hidden.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={profileData.password}
                  onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={profileData.confirmPassword}
                  onChange={e => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );

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
              <img src={currentImg.image_url} alt={imgField.label} className="w-full h-32 sm:h-40 object-cover" />
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
              className="w-full h-24 sm:h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-xs sm:text-sm truncate">{section.label}</h3>
            {section.listKey && (
              <span className="bg-muted text-muted-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                {getListItemCount(section.listKey)} items
              </span>
            )}
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
        </button>

        {isExpanded && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4 border-t pt-3 sm:pt-4">
            {section.fields.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {section.fields.map(f => renderField(f))}
              </div>
            )}

            {section.images && section.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {section.images.map(img => renderImageField(img))}
              </div>
            )}

            {section.listKey && section.listItem && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">{section.listLabel}s</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addListItem(section)}
                    disabled={saving || (section.maxItems ? getListItemCount(section.listKey!) >= section.maxItems : false)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add {section.listLabel}
                  </Button>
                </div>

                {Array.from({ length: getListItemCount(section.listKey) }).map((_, i) => (
                  <div key={i} className="bg-muted/30 border rounded-lg p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteListItem(section, i)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
    <div className="min-h-screen bg-background flex relative">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-card border-r flex flex-col shrink-0
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3 sm:p-4 border-b flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain" />
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm truncate">Pal Classes</p>
            <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
          </div>
          <button className="lg:hidden ml-auto p-1" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-2 sm:p-3 space-y-1 overflow-y-auto">
          <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Data</div>
          <button onClick={() => setActivePage("enquiries")} className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activePage === "enquiries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <FileText className="w-4 h-4" /> Enquiries
          </button>
          <button onClick={() => setActivePage("contacts")} className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activePage === "contacts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <Phone className="w-4 h-4" /> Messages
          </button>

          <button onClick={() => setActivePage("profile")} className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activePage === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <User className="w-4 h-4" /> My Profile
          </button>

          <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Content</div>
          {cmsPages.map((p) => {
            const Icon = ICON_MAP[p.icon] || FileText;
            return (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activePage === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-2 sm:p-3 border-t">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-background border-b p-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-sm font-bold truncate">
            {activePage === "enquiries" ? "Enquiries" : activePage === "contacts" ? "Messages" : activePage === "profile" ? "My Profile" : (pageConfig?.label || activePage)}
          </h1>
          {isCmsPage && hasDirtyFields && (
            <Button size="sm" onClick={saveAllDrafts} disabled={saving} className="ml-auto text-xs">
              {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
              Save ({Object.keys(drafts).length})
            </Button>
          )}
        </div>

        <div className="p-3 sm:p-4 lg:p-6 max-w-5xl mx-auto">
          {activePage === "enquiries" && renderEnquiries()}
          {activePage === "contacts" && renderContacts()}
          {activePage === "profile" && renderProfile()}

          {isCmsPage && (
            <>
              <div className="hidden lg:flex items-center justify-between mb-8">
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
                <div className="space-y-3 sm:space-y-4">
                  {pageConfig?.sections.map(section => renderSection(section))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
