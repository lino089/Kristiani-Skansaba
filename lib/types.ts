export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationStructureItem {
  id: string;
  role: string;
  name: string;
  level: 'pembina' | 'inti' | 'divisi' | 'guru' | 'siswa';
  division?: string;
  photo_url?: string;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  school_name: string;
  history: string;
  vision: string;
  mission: string[];
  structure: OrganizationStructureItem[];
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  class_year: number; // Tahun angkatan, contoh: 2024, 2025, 2026
  is_alumni: boolean;
  photo_url: string;
  contact_info?: string;
  instagram?: string;
  created_at: string;
}

export type AchievementLevel = 'Sekolah' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';

export interface Achievement {
  id: string;
  title: string;
  recipient_name: string;
  member_id?: string;
  level: AchievementLevel;
  year: number;
  certificate_url: string;
  description?: string;
  created_at: string;
}

export type EventStatus = 'upcoming' | 'completed';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  event_date: string; // ISO string YYYY-MM-DD
  time?: string;
  location: string;
  status: EventStatus;
  summary: string;
  description: string;
  cover_image_url: string;
  gallery_urls: string[];
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  event_name: string;
  year: number;
  image_url: string;
  description?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_members: number;
  total_achievements: number;
  total_events: number;
  upcoming_events_count: number;
  total_gallery: number;
  active_announcements_count: number;
}
