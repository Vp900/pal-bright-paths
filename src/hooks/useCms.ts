import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  page: string;
  section_key: string;
  content_type: string;
  content_value: string;
}

export interface SiteImage {
  id: string;
  page: string;
  section_key: string;
  image_url: string;
  display_order: number;
}

export const useCmsContent = (page?: string) => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    let contentQuery = supabase.from("site_content").select("*");
    let imageQuery = supabase.from("site_images").select("*");

    if (page) {
      contentQuery = contentQuery.eq("page", page);
      imageQuery = imageQuery.eq("page", page);
    }

    const [contentRes, imageRes] = await Promise.all([contentQuery, imageQuery]);
    setContent((contentRes.data as any[]) || []);
    setImages((imageRes.data as any[]) || []);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getContent = (sectionKey: string, fallback: string = ""): string => {
    const item = content.find(c => c.section_key === sectionKey && (!page || c.page === page));
    return item?.content_value || fallback;
  };

  const getImage = (sectionKey: string, fallback: string = ""): string => {
    const item = images.find(i => i.section_key === sectionKey && (!page || i.page === page));
    return item?.image_url || fallback;
  };

  // Get list items by prefix: e.g. "highlight_0_title", "highlight_1_title"
  const getListItems = (prefix: string, fields: string[]): Record<string, string>[] => {
    const items: Record<string, string>[] = [];
    for (let i = 0; i < 50; i++) {
      const firstField = fields[0];
      const key = `${prefix}_${i}_${firstField}`;
      const exists = content.find(c => c.section_key === key);
      if (!exists) break;
      const item: Record<string, string> = {};
      for (const f of fields) {
        item[f] = getContent(`${prefix}_${i}_${f}`, "");
      }
      items.push(item);
    }
    return items;
  };

  const getListImages = (prefix: string, imageKey: string): string[] => {
    const imgs: string[] = [];
    for (let i = 0; i < 50; i++) {
      const key = `${prefix}_${i}_${imageKey}`;
      const img = images.find(im => im.section_key === key);
      if (img) imgs.push(img.image_url);
      else {
        // Check if there's a content entry for this index
        const contentKey = content.find(c => c.section_key.startsWith(`${prefix}_${i}_`));
        if (!contentKey) break;
        imgs.push("");
      }
    }
    return imgs;
  };

  const upsertContent = async (sectionKey: string, value: string, contentType: string = "text", targetPage?: string) => {
    const p = targetPage || page || "home";
    const { error } = await supabase.from("site_content").upsert(
      { page: p, section_key: sectionKey, content_type: contentType, content_value: value },
      { onConflict: "page,section_key" }
    );
    if (!error) await fetchContent();
    return { error };
  };

  const upsertImage = async (sectionKey: string, imageUrl: string, targetPage?: string, displayOrder: number = 0) => {
    const p = targetPage || page || "home";
    const { error } = await supabase.from("site_images").upsert(
      { page: p, section_key: sectionKey, image_url: imageUrl, display_order: displayOrder },
      { onConflict: "page,section_key" }
    );
    if (!error) await fetchContent();
    return { error };
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase.from("site_content").delete().eq("id", id);
    if (!error) await fetchContent();
    return { error };
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase.from("site_images").delete().eq("id", id);
    if (!error) await fetchContent();
    return { error };
  };

  const deleteByKey = async (sectionKey: string, targetPage?: string) => {
    const p = targetPage || page || "home";
    await supabase.from("site_content").delete().eq("page", p).eq("section_key", sectionKey);
    await supabase.from("site_images").delete().eq("page", p).eq("section_key", sectionKey);
    await fetchContent();
  };

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("site-uploads")
      .upload(path, file, { upsert: true });
    if (error) return { url: null, error };
    const { data: urlData } = supabase.storage.from("site-uploads").getPublicUrl(data.path);
    return { url: urlData.publicUrl, error: null };
  };

  return {
    content, images, loading,
    getContent, getImage, getListItems, getListImages,
    upsertContent, upsertImage,
    deleteContent, deleteImage, deleteByKey,
    uploadImage, fetchContent,
  };
};

// Hook to fetch all content (no page filter) for global + specific page
export const useCmsAll = () => {
  return useCmsContent(undefined);
};
