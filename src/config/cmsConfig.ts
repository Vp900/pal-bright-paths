// CMS Configuration - Defines all pages, sections, and editable fields
// Admin dashboard reads this config to render appropriate editors

export interface CmsField {
  key: string;
  label: string;
  type: "text" | "textarea" | "html" | "url" | "number";
  placeholder?: string;
}

export interface CmsImageField {
  key: string;
  label: string;
}

export interface CmsListItem {
  fields: CmsField[];
  images?: CmsImageField[];
}

export interface CmsSection {
  id: string;
  label: string;
  fields: CmsField[];
  images?: CmsImageField[];
  // For repeatable items (e.g. testimonials, toppers, facilities)
  listKey?: string;
  listLabel?: string;
  listItem?: CmsListItem;
  maxItems?: number;
}

export interface CmsPage {
  id: string;
  label: string;
  icon: string;
  sections: CmsSection[];
}

export const cmsPages: CmsPage[] = [
  {
    id: "global",
    label: "Global Settings",
    icon: "Settings",
    sections: [
      {
        id: "header",
        label: "Header & Branding",
        fields: [
          { key: "site_name", label: "Site Name", type: "text", placeholder: "Pal Classes" },
          { key: "site_tagline", label: "Tagline", type: "text", placeholder: "Where Excellence is a Tradition" },
          { key: "topbar_phone", label: "Top Bar Phone", type: "text", placeholder: "+91 80803 21805" },
          { key: "topbar_email", label: "Top Bar Email", type: "text", placeholder: "info@palclasses.com" },
          { key: "topbar_location", label: "Top Bar Location", type: "text", placeholder: "Wadala East, Mumbai" },
        ],
        images: [
          { key: "site_logo", label: "Site Logo" },
        ],
      },
      {
        id: "footer",
        label: "Footer",
        fields: [
          { key: "footer_description", label: "Footer Description", type: "textarea" },
          { key: "footer_copyright", label: "Copyright Text", type: "text" },
          { key: "facebook_url", label: "Facebook URL", type: "url" },
          { key: "instagram_url", label: "Instagram URL", type: "url" },
          { key: "youtube_url", label: "YouTube URL", type: "url" },
          { key: "whatsapp_number", label: "WhatsApp Number", type: "text", placeholder: "918080321805" },
        ],
      },
      {
        id: "contact_info",
        label: "Contact Information",
        fields: [
          { key: "address", label: "Full Address", type: "textarea" },
          { key: "phone1", label: "Phone 1", type: "text" },
          { key: "phone2", label: "Phone 2", type: "text" },
          { key: "email1", label: "Email 1", type: "text" },
          { key: "email2", label: "Email 2", type: "text" },
          { key: "working_hours", label: "Working Hours", type: "textarea" },
          { key: "map_embed_url", label: "Google Map Embed URL", type: "url" },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Home",
    icon: "Home",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_badge", label: "Badge Text", type: "text", placeholder: "🎓 Admissions Open for 2025-26" },
          { key: "hero_title", label: "Heading", type: "text", placeholder: "Shaping Bright Futures with" },
          { key: "hero_highlight", label: "Highlight Text", type: "text", placeholder: "Quality Education" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
          { key: "hero_btn1_text", label: "Button 1 Text", type: "text", placeholder: "Book Free Demo" },
          { key: "hero_btn1_link", label: "Button 1 Link", type: "url", placeholder: "/admission" },
          { key: "hero_btn2_text", label: "Button 2 Text", type: "text", placeholder: "Enroll Now" },
          { key: "hero_btn2_link", label: "Button 2 Link", type: "url", placeholder: "/admission" },
        ],
        images: [{ key: "hero_image", label: "Hero Background Image" }],
      },
      {
        id: "highlights",
        label: "Why Choose Us (Highlights)",
        fields: [
          { key: "highlights_title", label: "Section Title", type: "text" },
          { key: "highlights_subtitle", label: "Section Subtitle", type: "textarea" },
        ],
        listKey: "highlight",
        listLabel: "Highlight Card",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon Name", type: "text", placeholder: "UserCheck, Users, Target, BookOpen" },
          ],
        },
        maxItems: 6,
      },
      {
        id: "stats",
        label: "Statistics",
        fields: [],
        listKey: "stat",
        listLabel: "Stat Item",
        listItem: {
          fields: [
            { key: "value", label: "Value", type: "text", placeholder: "15" },
            { key: "suffix", label: "Suffix", type: "text", placeholder: "+" },
            { key: "label", label: "Label", type: "text", placeholder: "Years Experience" },
          ],
        },
        maxItems: 4,
      },
      {
        id: "facilities_preview",
        label: "Facilities Preview",
        fields: [
          { key: "facilities_title", label: "Section Title", type: "text" },
          { key: "facilities_subtitle", label: "Section Subtitle", type: "textarea" },
        ],
        listKey: "facility",
        listLabel: "Facility Card",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
          ],
        },
        maxItems: 8,
      },
      {
        id: "programs",
        label: "Programs Preview",
        fields: [
          { key: "programs_title", label: "Section Title", type: "text" },
          { key: "programs_subtitle", label: "Section Subtitle", type: "textarea" },
        ],
        listKey: "program",
        listLabel: "Program Card",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subjects", label: "Subjects", type: "text" },
            { key: "icon", label: "Icon/Emoji", type: "text" },
          ],
        },
        maxItems: 4,
      },
      {
        id: "testimonials",
        label: "Testimonials",
        fields: [
          { key: "testimonials_title", label: "Section Title", type: "text" },
        ],
        listKey: "testimonial",
        listLabel: "Testimonial",
        listItem: {
          fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "class", label: "Class / Role", type: "text" },
            { key: "text", label: "Testimonial Text", type: "textarea" },
            { key: "rating", label: "Rating (1-5)", type: "number" },
          ],
        },
        maxItems: 10,
      },
      {
        id: "cta",
        label: "Call to Action",
        fields: [
          { key: "cta_title", label: "Heading", type: "text" },
          { key: "cta_subtitle", label: "Subtitle", type: "textarea" },
          { key: "cta_btn1_text", label: "Button 1 Text", type: "text" },
          { key: "cta_btn1_link", label: "Button 1 Link", type: "url" },
          { key: "cta_btn2_text", label: "Button 2 Text", type: "text" },
          { key: "cta_btn2_link", label: "Button 2 Link", type: "url" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About Us",
    icon: "Info",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "vision",
        label: "Vision & Mission",
        fields: [
          { key: "vision_title", label: "Vision Title", type: "text" },
          { key: "vision_text", label: "Vision Text", type: "textarea" },
          { key: "mission_title", label: "Mission Title", type: "text" },
          { key: "mission_text", label: "Mission Text", type: "textarea" },
        ],
        images: [
          { key: "classroom_image", label: "Classroom Image" },
        ],
      },
      {
        id: "founder",
        label: "Founder's Message",
        fields: [
          { key: "founder_name", label: "Founder Name", type: "text" },
          { key: "founder_title", label: "Founder Title", type: "text" },
          { key: "founder_message", label: "Message", type: "textarea" },
        ],
        images: [
          { key: "founder_image", label: "Founder Photo" },
        ],
      },
      {
        id: "methodology",
        label: "Teaching Methodology",
        fields: [
          { key: "methodology_title", label: "Section Title", type: "text" },
        ],
        listKey: "method",
        listLabel: "Method Item",
        listItem: {
          fields: [
            { key: "text", label: "Item Text", type: "text" },
          ],
        },
        maxItems: 10,
        images: [
          { key: "students_image", label: "Students Image" },
        ],
      },
      {
        id: "why_choose",
        label: "Why Choose Pal Classes",
        fields: [
          { key: "why_title", label: "Section Title", type: "text" },
        ],
        listKey: "reason",
        listLabel: "Reason",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
          ],
        },
        maxItems: 6,
      },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    icon: "BookOpen",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "course_list",
        label: "Courses",
        fields: [],
        listKey: "course",
        listLabel: "Course",
        listItem: {
          fields: [
            { key: "level", label: "Level Name", type: "text" },
            { key: "classes", label: "Classes", type: "text" },
            { key: "icon", label: "Icon/Emoji", type: "text" },
            { key: "subjects", label: "Subjects (comma separated)", type: "text" },
            { key: "features", label: "Features (comma separated)", type: "textarea" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "method", label: "Teaching Method", type: "textarea" },
            { key: "batchSize", label: "Batch Size", type: "text" },
          ],
        },
        maxItems: 6,
      },
    ],
  },
  {
    id: "facilities",
    label: "Facilities",
    icon: "Settings",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_badge", label: "Badge Text", type: "text" },
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "stats",
        label: "Stats Bar",
        fields: [],
        listKey: "stat",
        listLabel: "Stat",
        listItem: {
          fields: [
            { key: "value", label: "Value", type: "text" },
            { key: "label", label: "Label", type: "text" },
          ],
        },
        maxItems: 4,
      },
      {
        id: "facility_list",
        label: "Facilities Detail",
        fields: [],
        listKey: "facility",
        listLabel: "Facility",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
            { key: "highlights", label: "Highlights (comma separated)", type: "textarea" },
          ],
          images: [{ key: "image", label: "Facility Image" }],
        },
        maxItems: 8,
      },
      {
        id: "cta",
        label: "Call to Action",
        fields: [
          { key: "cta_title", label: "Heading", type: "text" },
          { key: "cta_subtitle", label: "Subtitle", type: "textarea" },
          { key: "cta_btn_text", label: "Button Text", type: "text" },
          { key: "cta_btn_link", label: "Button Link", type: "url" },
        ],
      },
    ],
  },
  {
    id: "results",
    label: "Results",
    icon: "Award",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "toppers",
        label: "Toppers",
        fields: [
          { key: "toppers_title", label: "Section Title", type: "text" },
        ],
        listKey: "topper",
        listLabel: "Topper",
        listItem: {
          fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "class", label: "Exam/Board", type: "text" },
            { key: "score", label: "Score", type: "text" },
            { key: "year", label: "Year", type: "text" },
          ],
          images: [{ key: "photo", label: "Topper Photo" }],
        },
        maxItems: 20,
        images: [{ key: "celebrating_image", label: "Celebration Image" }],
      },
      {
        id: "achievements",
        label: "Awards & Recognition",
        fields: [
          { key: "achievements_title", label: "Section Title", type: "text" },
        ],
        listKey: "achievement",
        listLabel: "Achievement",
        listItem: {
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
          ],
        },
        maxItems: 8,
      },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: "GalleryHorizontal",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "images",
        label: "Gallery Images",
        fields: [
          { key: "categories", label: "Categories (comma separated)", type: "text", placeholder: "All,Classrooms,Teaching,Activities,Events" },
        ],
        listKey: "gallery_item",
        listLabel: "Gallery Image",
        listItem: {
          fields: [
            { key: "alt", label: "Alt Text / Caption", type: "text" },
            { key: "category", label: "Category", type: "text" },
          ],
          images: [{ key: "image", label: "Image" }],
        },
        maxItems: 30,
      },
    ],
  },
  {
    id: "admission",
    label: "Admission",
    icon: "GraduationCap",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "process",
        label: "Admission Process",
        fields: [
          { key: "process_title", label: "Section Title", type: "text" },
        ],
        listKey: "step",
        listLabel: "Step",
        listItem: {
          fields: [
            { key: "title", label: "Step Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },
          ],
        },
        maxItems: 6,
      },
      {
        id: "fees",
        label: "Fee Structure",
        fields: [
          { key: "fees_title", label: "Section Title", type: "text" },
          { key: "fees_note", label: "Note", type: "textarea" },
        ],
        listKey: "fee",
        listLabel: "Fee Level",
        listItem: {
          fields: [
            { key: "level", label: "Level Name", type: "text" },
            { key: "monthly", label: "Monthly Fee", type: "text" },
            { key: "yearly", label: "Yearly Fee", type: "text" },
          ],
        },
        maxItems: 6,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: "Phone",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          { key: "hero_title", label: "Heading", type: "text" },
          { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        id: "info",
        label: "Contact Page Content",
        fields: [
          { key: "contact_heading", label: "Section Heading", type: "text" },
          { key: "contact_text", label: "Section Text", type: "textarea" },
          { key: "form_heading", label: "Form Heading", type: "text" },
        ],
      },
    ],
  },
];

// Helper to get page config
export const getPageConfig = (pageId: string): CmsPage | undefined => {
  return cmsPages.find((p) => p.id === pageId);
};
