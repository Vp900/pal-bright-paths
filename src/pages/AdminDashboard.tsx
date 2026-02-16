import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCmsContent } from "@/hooks/useCms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, Save, Trash2, Upload, Plus, Loader2, Image as ImageIcon,
  FileText, Home, Info, BookOpen, Award, GalleryHorizontal, Phone,
  GraduationCap, Settings, Check, X, Edit2
} from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const PAGES = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About Us", icon: Info },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "facilities", label: "Facilities", icon: Settings },
  { id: "results", label: "Results", icon: Award },
  { id: "gallery", label: "Gallery", icon: GalleryHorizontal },
  { id: "admission", label: "Admission", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Phone },
];

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");
  const { content, images, loading, upsertContent, upsertImage, deleteContent, deleteImage, uploadImage, fetchContent } = useCmsContent(activePage);

  // New content form
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("text");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKey, setUploadingKey] = useState("");
  const [newImageKey, setNewImageKey] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleAddContent = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setSaving(true);
    await upsertContent(newKey.trim(), newValue.trim(), newType);
    setNewKey("");
    setNewValue("");
    setSaving(false);
  };

  const handleSaveEdit = async (item: any) => {
    setSaving(true);
    await upsertContent(item.section_key, editValue, item.content_type, item.page);
    setEditingId(null);
    setSaving(false);
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm("Delete this content?")) {
      await deleteContent(id);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Delete this image?")) {
      await deleteImage(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingKey) return;
    setSaving(true);
    const path = `${activePage}/${Date.now()}-${file.name}`;
    const { url, error } = await uploadImage(file, path);
    if (url) {
      await upsertImage(uploadingKey, url, activePage);
    }
    setUploadingKey("");
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startImageUpload = (key: string) => {
    setUploadingKey(key);
    fileInputRef.current?.click();
  };

  const handleAddNewImage = () => {
    if (!newImageKey.trim()) return;
    setUploadingKey(newImageKey.trim());
    setNewImageKey("");
    fileInputRef.current?.click();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

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
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <p.icon className="w-4 h-4" />
              {p.label}
            </button>
          ))}
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
              <h1 className="font-heading text-2xl font-bold capitalize">{activePage} Page</h1>
              <p className="text-muted-foreground text-sm">Manage content and images for this page</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchContent}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Text Content Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-semibold">Text Content</h2>
                </div>

                {/* Existing content */}
                <div className="space-y-3 mb-6">
                  {content.length === 0 && (
                    <p className="text-muted-foreground text-sm py-4 text-center bg-muted/50 rounded-lg">
                      No content added yet. Add your first content below.
                    </p>
                  )}
                  {content.map((item: any) => (
                    <div key={item.id} className="bg-card border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">{item.section_key}</span>
                            <span className="text-xs text-muted-foreground">{item.content_type}</span>
                          </div>
                          {editingId === item.id ? (
                            <div className="flex gap-2">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm resize-none min-h-[80px]"
                              />
                              <div className="flex flex-col gap-1">
                                <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(item)} disabled={saving}>
                                  <Check className="w-4 h-4 text-primary" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-foreground whitespace-pre-wrap">{item.content_value}</p>
                          )}
                        </div>
                        {editingId !== item.id && (
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => { setEditingId(item.id); setEditValue(item.content_value); }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteContent(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new content */}
                <div className="bg-muted/50 border border-dashed rounded-xl p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Content</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <Input placeholder="Section Key (e.g. hero_title)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
                      <option value="text">Text</option>
                      <option value="html">HTML</option>
                      <option value="json">JSON</option>
                    </select>
                    <Button onClick={handleAddContent} disabled={saving || !newKey.trim() || !newValue.trim()}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                  </div>
                  <textarea
                    placeholder="Content value..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none min-h-[80px]"
                  />
                </div>
              </section>

              {/* Images Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-semibold">Images</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {images.length === 0 && (
                    <p className="text-muted-foreground text-sm py-4 text-center bg-muted/50 rounded-lg col-span-full">
                      No images added yet. Upload your first image below.
                    </p>
                  )}
                  {images.map((img: any) => (
                    <div key={img.id} className="bg-card border rounded-xl overflow-hidden">
                      <div className="aspect-video relative group">
                        <img src={img.image_url} alt={img.section_key} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button size="icon" variant="secondary" onClick={() => startImageUpload(img.section_key)}>
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDeleteImage(img.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">{img.section_key}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new image */}
                <div className="bg-muted/50 border border-dashed rounded-xl p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Upload New Image</h3>
                  <div className="flex gap-3">
                    <Input placeholder="Image Key (e.g. hero_image)" value={newImageKey} onChange={(e) => setNewImageKey(e.target.value)} />
                    <Button onClick={handleAddNewImage} disabled={!newImageKey.trim() || saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
