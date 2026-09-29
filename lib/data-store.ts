import {
  Announcement,
  OrganizationProfile,
  Member,
  Achievement,
  EventItem,
  GalleryItem,
  DashboardMetrics,
} from './types';
import { isSupabaseConfigured, supabaseAdmin as supabase } from './supabase';

const DEFAULT_EMPTY_PROFILE: OrganizationProfile = {
  id: 'default',
  name: 'Persekutuan Siswa Kristiani SMKN 1 Bantul',
  school_name: 'SMK Negeri 1 Bantul',
  history: '',
  vision: '',
  mission: [],
  structure: [],
  updated_at: new Date().toISOString(),
};

function getSupabaseClient() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase client is not configured in environment variables.');
  }
  return supabase;
}

// --- PENGUMUMAN (ANNOUNCEMENTS) ---
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements from Supabase:', error);
      return [];
    }
    return (data || []) as Announcement[];
  } catch (err) {
    console.error('Failed to get announcements:', err);
    return [];
  }
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active announcement:', error);
      return null;
    }
    return (data as Announcement) || null;
  } catch (err) {
    console.error('Failed to get active announcement:', err);
    return null;
  }
}

export async function saveAnnouncement(
  announcement: Partial<Announcement> & { title: string; content: string }
): Promise<Announcement> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (announcement.id) {
    const { data, error } = await client
      .from('announcements')
      .update({ ...announcement, updated_at: now })
      .eq('id', announcement.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui pengumuman: ${error?.message || 'Data tidak ditemukan'}`);
    }
    return data as Announcement;
  } else {
    const { data, error } = await client
      .from('announcements')
      .insert([
        {
          ...announcement,
          is_active: announcement.is_active ?? true,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal membuat pengumuman: ${error?.message}`);
    }
    return data as Announcement;
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  return deleteAnnouncements([id]);
}

export async function deleteAnnouncements(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const client = getSupabaseClient();
  const { error } = await client.from('announcements').delete().in('id', ids);
  if (error) {
    throw new Error(`Gagal menghapus pengumuman: ${error.message}`);
  }
  return true;
}

// --- PROFIL ORGANISASI (ORGANIZATION PROFILE) ---
export async function getProfile(): Promise<OrganizationProfile> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('organization_profile')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization profile:', error);
      return { ...DEFAULT_EMPTY_PROFILE };
    }
    return (data as OrganizationProfile) || { ...DEFAULT_EMPTY_PROFILE };
  } catch (err) {
    console.error('Failed to get profile:', err);
    return { ...DEFAULT_EMPTY_PROFILE };
  }
}

export async function updateProfile(profile: Partial<OrganizationProfile>): Promise<OrganizationProfile> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  const current = await getProfile();

  const payload = {
    ...current,
    ...profile,
    id: 'default',
    updated_at: now,
  };

  const { data, error } = await client
    .from('organization_profile')
    .upsert(payload)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Gagal memperbarui profil organisasi: ${error?.message || 'Gagal menyimpan data'}`);
  }
  return data as OrganizationProfile;
}

// --- ANGGOTA & ALUMNI (MEMBERS) ---
export async function getMembers(): Promise<Member[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('members')
      .select('*')
      .order('class_year', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    return (data || []) as Member[];
  } catch (err) {
    console.error('Failed to get members:', err);
    return [];
  }
}

export async function saveMember(
  member: Partial<Member> & { name: string; class_year: number; role: string }
): Promise<Member> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (member.id) {
    const { data, error } = await client
      .from('members')
      .update(member)
      .eq('id', member.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui data siswa: ${error?.message}`);
    }
    return data as Member;
  } else {
    const { data, error } = await client
      .from('members')
      .insert([{ ...member, created_at: now }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal menambahkan data siswa: ${error?.message}`);
    }
    return data as Member;
  }
}

export async function deleteMember(id: string): Promise<boolean> {
  return deleteMembers([id]);
}

export async function deleteMembers(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const client = getSupabaseClient();
  const { error } = await client.from('members').delete().in('id', ids);
  if (error) {
    throw new Error(`Gagal menghapus data siswa: ${error.message}`);
  }
  return true;
}

// --- PRESTASI (ACHIEVEMENTS) ---
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    return (data || []) as Achievement[];
  } catch (err) {
    console.error('Failed to get achievements:', err);
    return [];
  }
}

export async function saveAchievement(
  achievement: Partial<Achievement> & {
    title: string;
    recipient_name: string;
    year: number;
    level: Achievement['level'];
  }
): Promise<Achievement> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (achievement.id) {
    const { data, error } = await client
      .from('achievements')
      .update(achievement)
      .eq('id', achievement.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui prestasi: ${error?.message}`);
    }
    return data as Achievement;
  } else {
    const { data, error } = await client
      .from('achievements')
      .insert([{ ...achievement, created_at: now }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal menambahkan prestasi: ${error?.message}`);
    }
    return data as Achievement;
  }
}

export async function deleteAchievement(id: string): Promise<boolean> {
  return deleteAchievements([id]);
}

export async function deleteAchievements(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const client = getSupabaseClient();
  const { error } = await client.from('achievements').delete().in('id', ids);
  if (error) {
    throw new Error(`Gagal menghapus prestasi: ${error.message}`);
  }
  return true;
}

// --- KEGIATAN (EVENTS) ---
export async function getEvents(): Promise<EventItem[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return (data || []) as EventItem[];
  } catch (err) {
    console.error('Failed to get events:', err);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('events')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching event by slug:', error);
      return null;
    }
    return (data as EventItem) || null;
  } catch (err) {
    console.error('Failed to get event by slug:', err);
    return null;
  }
}

export async function saveEvent(
  event: Partial<EventItem> & {
    title: string;
    event_date: string;
    location: string;
    status: EventItem['status'];
  }
): Promise<EventItem> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  const slug =
    event.slug ||
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  if (event.id) {
    const { data, error } = await client
      .from('events')
      .update({ ...event, slug })
      .eq('id', event.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui kegiatan: ${error?.message}`);
    }
    return data as EventItem;
  } else {
    const { data, error } = await client
      .from('events')
      .insert([{ ...event, slug, created_at: now }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal menambahkan kegiatan: ${error?.message}`);
    }
    return data as EventItem;
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  return deleteEvents([id]);
}

export async function deleteEvents(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const client = getSupabaseClient();
  const { error } = await client.from('events').delete().in('id', ids);
  if (error) {
    throw new Error(`Gagal menghapus kegiatan: ${error.message}`);
  }
  return true;
}

// --- GALERI (GALLERY) ---
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
    return (data || []) as GalleryItem[];
  } catch (err) {
    console.error('Failed to get gallery:', err);
    return [];
  }
}

export async function saveGalleryItem(
  item: Partial<GalleryItem> & {
    title: string;
    event_name: string;
    year: number;
    image_url: string;
  }
): Promise<GalleryItem> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (item.id) {
    const { data, error } = await client
      .from('gallery')
      .update(item)
      .eq('id', item.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui foto galeri: ${error?.message}`);
    }
    return data as GalleryItem;
  } else {
    const { data, error } = await client
      .from('gallery')
      .insert([{ ...item, created_at: now }])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal menambahkan foto galeri: ${error?.message}`);
    }
    return data as GalleryItem;
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  return deleteGalleryItems([id]);
}

export async function deleteGalleryItems(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const client = getSupabaseClient();
  const { error } = await client.from('gallery').delete().in('id', ids);
  if (error) {
    throw new Error(`Gagal menghapus foto galeri: ${error.message}`);
  }
  return true;
}

// --- DASBOR METRIK (DASHBOARD METRICS) ---
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [members, achievements, events, gallery, announcements] = await Promise.all([
    getMembers(),
    getAchievements(),
    getEvents(),
    getGallery(),
    getAnnouncements(),
  ]);

  return {
    total_members: members.length,
    total_achievements: achievements.length,
    total_events: events.length,
    upcoming_events_count: events.filter((e) => e.status === 'upcoming').length,
    total_gallery: gallery.length,
    active_announcements_count: announcements.filter((a) => a.is_active).length,
  };
}
