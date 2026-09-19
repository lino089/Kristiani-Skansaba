-- =========================================================
-- Skema Database PostgreSQL untuk Supabase
-- Komunitas Siswa Kristiani Skansaba (PRD v1.0.0)
-- =========================================================

-- 1. Tabel Pengumuman (Announcements)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Profil Organisasi (Organization Profile)
CREATE TABLE IF NOT EXISTS public.organization_profile (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL DEFAULT 'Komunitas Siswa Kristiani Skansaba',
    school_name TEXT NOT NULL DEFAULT 'SMK Negeri 1 Bantul (Skansaba)',
    history TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission JSONB NOT NULL DEFAULT '[]'::jsonb,
    structure JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Anggota & Alumni (Members)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Anggota',
    class_year INTEGER NOT NULL,
    is_alumni BOOLEAN DEFAULT false,
    photo_url TEXT DEFAULT '',
    contact_info TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Prestasi (Achievements)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    level TEXT NOT NULL CHECK (level IN ('Sekolah', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
    year INTEGER NOT NULL,
    certificate_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Kegiatan (Events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    event_date DATE NOT NULL,
    time TEXT DEFAULT '',
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'completed')),
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT DEFAULT '',
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel Galeri Multimedia (Gallery)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- Konfigurasi Row-Level Security (RLS) - PRD Bagian 5.3
-- =========================================================

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 1. Policy Pengumuman
CREATE POLICY "Public can view announcements" ON public.announcements
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Policy Profil Organisasi
CREATE POLICY "Public can view organization profile" ON public.organization_profile
    FOR SELECT USING (true);
CREATE POLICY "Admins can update organization profile" ON public.organization_profile
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Policy Anggota
CREATE POLICY "Public can view members" ON public.members
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage members" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Policy Prestasi
CREATE POLICY "Public can view achievements" ON public.achievements
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Policy Kegiatan
CREATE POLICY "Public can view events" ON public.events
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Policy Galeri
CREATE POLICY "Public can view gallery" ON public.gallery
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- Indeks Kinerja
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_members_class_year ON public.members (class_year);
CREATE INDEX IF NOT EXISTS idx_members_is_alumni ON public.members (is_alumni);
CREATE INDEX IF NOT EXISTS idx_achievements_year ON public.achievements (year DESC);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events (slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_year ON public.gallery (year DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements (is_active);
