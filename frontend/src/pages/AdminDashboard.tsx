import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCmsContent } from "@/hooks/useCms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, Save, Trash2, Upload, Plus, Loader2,
  FileText, Home, Info, BookOpen, Award, GalleryHorizontal, Phone,
  GraduationCap, Settings, Check, ChevronDown, ChevronRight, RefreshCw, Menu, X, User, ClipboardList
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
  const [demoBookings, setDemoBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
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
    if (activePage === "demo-bookings") fetchDemos();
    if (activePage === "contacts") fetchContacts();
    if (activePage === "admissions") fetchAdmissions();
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

  const fetchDemos = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/demo`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setDemoBookings(await res.json());
    } catch (e) {
      toast.error("Failed to load demo bookings");
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

  const fetchAdmissions = async () => {
    setDataLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admission`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setAdmissions(await res.json());
    } catch (e) {
      toast.error("Failed to load admissions");
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">General Enquiries</h2>
        <Button variant="outline" size="sm" onClick={fetchEnquiries} disabled={dataLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {enquiries.map((enq) => (
            <div key={enq._id || enq.id} className="bg-card p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{enq.name}</h3>
                  <p className="text-sm font-medium text-primary">Class: {enq.class || "N/A"}</p>
                </div>
                <span className="text-[10px] font-bold uppercase py-1 px-3 rounded-full bg-slate-100 text-slate-600">
                  Enquiry
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4 bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{enq.phone}</span>
                </div>
              </div>

              {enq.message && (
                <div className="relative pl-4 border-l-2 border-primary/20 italic text-slate-600 text-sm py-1 mb-3">
                  "{enq.message}"
                </div>
              )}

              <div className="text-[10px] text-slate-400 mt-2 pt-3 border-t">
                Received: {new Date(enq.date).toLocaleString()}
              </div>
            </div>
          ))}
          {enquiries.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400">No general enquiries found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">Messages</h2>
        <Button variant="outline" size="sm" onClick={fetchContacts} disabled={dataLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact._id || contact.id} className="bg-card p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{contact.name}</h3>
                  <p className="text-sm font-semibold text-primary">{contact.subject || 'Website Message'}</p>
                </div>
                <span className="text-[10px] font-bold uppercase py-1 px-3 rounded-full bg-slate-100 text-slate-600">
                  Message
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4 bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </div>

              <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t">
                Received: {new Date(contact.date).toLocaleString()}
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400">No contact messages found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAdmissions = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">Admission Applications</h2>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {admissions.map((adm) => (
            <div key={adm._id || adm.id} className="bg-card p-4 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary">{adm.studentName}</h3>
                  <p className="text-sm font-semibold">Parent: {adm.parentName}</p>
                  <p className="text-sm text-muted-foreground">{adm.email || 'No Email'} | {adm.phone}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase">
                  Class {adm.class}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t pt-3">
                <p><span className="text-muted-foreground font-medium">DOB:</span> {adm.dateOfBirth}</p>
                <p><span className="text-muted-foreground font-medium">Gender:</span> {adm.gender}</p>
                <p className="sm:col-span-2"><span className="text-muted-foreground font-medium">Address:</span> {adm.address}</p>
                {adm.previousSchool && <p className="sm:col-span-2"><span className="text-muted-foreground font-medium">School:</span> {adm.previousSchool}</p>}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-[10px] text-muted-foreground">Received: {new Date(adm.date).toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase py-1 px-2 rounded bg-slate-100">{adm.status}</span>
              </div>
            </div>
          ))}
          {admissions.length === 0 && <p className="text-center text-muted-foreground py-10">No admission records found.</p>}
        </div>
      )}
    </div>
  );

  const renderDemoBookings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">Demo Bookings</h2>
        <Button variant="outline" size="sm" onClick={fetchDemos} disabled={dataLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      {dataLoading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {demoBookings.map((demo) => (
            <div key={demo._id || demo.id} className="bg-card p-5 rounded-xl border border-primary/20 bg-primary/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{demo.name}</h3>
                  <p className="text-sm font-semibold text-primary">Class: {demo.class}</p>
                </div>
                <span className="text-[10px] font-bold uppercase py-1 px-3 rounded-full bg-primary text-white">
                  Demo Request
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-2 bg-white/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{demo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date: <span className="font-bold text-primary">{demo.preferredDate}</span></span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 mt-2 pt-3 border-t border-primary/10">
                Received: {new Date(demo.date).toLocaleString()}
              </div>
            </div>
          ))}
          {demoBookings.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400">No demo class bookings found.</p>
            </div>
          )}
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
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans text-slate-900">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0
        transition-all duration-300 shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
            <img src={logoImg} alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm border border-slate-100 p-1 relative z-10" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-none mb-1">Pal Classes</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
          </div>
          <button className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
          {/* 1. Global Section */}
          <div>
            <div className="mb-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Configuration</div>
            {cmsPages.filter(p => p.id === "global").map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === p.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Settings className={`w-4 h-4 ${activePage === p.id ? "text-white" : "text-slate-400"}`} />
                <span>Global Settings</span>
              </button>
            ))}
          </div>

          {/* 2. Content Section */}
          <div>
            <div className="mb-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Website Content</div>
            <div className="space-y-1">
              {cmsPages.filter(p => p.id !== "global").map((p) => {
                const Icon = ICON_MAP[p.icon] || FileText;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePage(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === p.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${activePage === p.id ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{p.label} Page</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Data Section */}
          <div>
            <div className="mb-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Inquiries</div>
            <div className="space-y-1">
              <button onClick={() => setActivePage("admissions")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === "admissions" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <ClipboardList className={`w-4 h-4 ${activePage === "admissions" ? "text-white" : "text-slate-400"}`} /> Admissions
              </button>
              <button onClick={() => setActivePage("enquiries")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === "enquiries" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <FileText className={`w-4 h-4 ${activePage === "enquiries" ? "text-white" : "text-slate-400"}`} /> Enquiries
              </button>
              <button onClick={() => setActivePage("demo-bookings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === "demo-bookings" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <GraduationCap className={`w-4 h-4 ${activePage === "demo-bookings" ? "text-white" : "text-slate-400"}`} /> Demo Bookings
              </button>
              <button onClick={() => setActivePage("contacts")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === "contacts" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Phone className={`w-4 h-4 ${activePage === "contacts" ? "text-white" : "text-slate-400"}`} /> Messages
              </button>
            </div>
          </div>

          {/* 4. Profile Section */}
          <div>
            <div className="mb-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Account</div>
            <button onClick={() => setActivePage("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activePage === "profile" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <User className={`w-4 h-4 ${activePage === "profile" ? "text-white" : "text-slate-400"}`} /> My Profile
            </button>
          </div>
        </nav>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 lg:hidden rounded-xl hover:bg-slate-50 text-slate-500 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">
                {activePage === "admissions" ? "Student Admissions" : activePage === "enquiries" ? "General Enquiries" : activePage === "demo-bookings" ? "Demo Class Bookings" : activePage === "contacts" ? "Contact Messages" : activePage === "profile" ? "My Account Profile" : (pageConfig?.label || activePage)}
              </h1>
              <p className="text-xs text-slate-400 font-medium">Dashboard / {activePage.charAt(0).toUpperCase() + activePage.slice(1)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isCmsPage && hasDirtyFields && (
              <Button size="sm" onClick={saveAllDrafts} disabled={saving} className="shadow-lg shadow-primary/20">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                <span className="hidden sm:inline">Save Changes ({Object.keys(drafts).length})</span>
                <span className="sm:hidden">Save ({Object.keys(drafts).length})</span>
              </Button>
            )}

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors font-bold text-xs uppercase tracking-wider" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-10">
          <div className="max-w-5xl mx-auto pb-20">
            {activePage === "admissions" && renderAdmissions()}
            {activePage === "enquiries" && renderEnquiries()}
            {activePage === "demo-bookings" && renderDemoBookings()}
            {activePage === "contacts" && renderContacts()}
            {activePage === "profile" && renderProfile()}

            {isCmsPage && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Page Configuration</h2>
                  <Button variant="ghost" size="sm" onClick={activeCms.fetchContent} className="text-slate-400 hover:text-primary">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Data
                  </Button>
                </div>

                {activeCms.loading ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                      <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
                    </div>
                    <p className="mt-4 text-slate-400 font-medium text-sm">Loading content editors...</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {pageConfig?.sections.map(section => renderSection(section))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>

  );
};

export default AdminDashboard;
