
-- Add unique constraints for upsert to work properly
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_content_page_section ON public.site_content(page, section_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_images_page_section ON public.site_images(page, section_key);

-- Create form submissions table
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL, -- 'enquiry', 'demo', 'contact'
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  class_level TEXT,
  message TEXT,
  preferred_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit forms (insert)
CREATE POLICY "Anyone can submit forms"
ON public.form_submissions FOR INSERT
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view submissions"
ON public.form_submissions FOR SELECT
USING (public.is_admin());

-- Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.form_submissions FOR DELETE
USING (public.is_admin());
