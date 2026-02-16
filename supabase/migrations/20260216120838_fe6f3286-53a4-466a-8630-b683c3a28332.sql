
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Shorthand for current user admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Site content table
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'text',
    content_value TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(page, section_key)
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read, admin can CRUD
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admin can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admin can delete site content" ON public.site_content FOR DELETE TO authenticated USING (public.is_admin());

-- Site images table
CREATE TABLE public.site_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    section_key TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(page, section_key)
);
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admin can insert site images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update site images" ON public.site_images FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admin can delete site images" ON public.site_images FOR DELETE TO authenticated USING (public.is_admin());

-- User roles policies - admin can manage, users can read own
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('site-uploads', 'site-uploads', true);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'site-uploads');
CREATE POLICY "Admin can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-uploads' AND public.is_admin());
CREATE POLICY "Admin can update uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-uploads' AND public.is_admin());
CREATE POLICY "Admin can delete uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-uploads' AND public.is_admin());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
