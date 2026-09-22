import {
  Announcement,
  OrganizationProfile,
  Member,
  Achievement,
  EventItem,
  GalleryItem,
  DashboardMetrics,
} from './types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PROFILE,
  INITIAL_MEMBERS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
} from './seed-data';
import { isSupabaseConfigured, supabaseAdmin as supabase } from './supabase';

// In-memory fallback stores (cloned from seed data)
let mockAnnouncements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let mockProfile: OrganizationProfile = { ...INITIAL_PROFILE };
let mockMembers: Member[] = [...INITIAL_MEMBERS];
let mockAchievements: Achievement[] = [...INITIAL_ACHIEVEMENTS];
let mockEvents: EventItem[] = [...INITIAL_EVENTS];
let mockGallery: GalleryItem[] = [...INITIAL_GALLERY];

// --- PENGUMUMAN (ANNOUNCEMENTS) ---
export async function getAnnouncements(): Promise<Announcement[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data as Announcement[];
  }
  return [...mockAnnouncements];
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const all = await getAnnouncements();
  return all.find((a) => a.is_active) || null;
}

export async function saveAnnouncement(announcement: Partial<Announcement> & { title: string; content: string }): Promise<Announcement> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabase) {
    if (announcement.id) {
      const { data, error } = await supabase
        .from('announcements')
        .update({ ...announcement, updated_at: now })
        .eq('id', announcement.id)
        .select()
        .single();
      if (!error && data) return data as Announcement;
    } else {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{ ...announcement, is_active: announcement.is_active ?? true, created_at: now, updated_at: now }])
        .select()
        .single();
      if (!error && data) return data as Announcement;
    }
  }

  // Fallback in-memory
  if (announcement.id) {
    const idx = mockAnnouncements.findIndex((a) => a.id === announcement.id);
    if (idx !== -1) {
      mockAnnouncements[idx] = { ...mockAnnouncements[idx], ...announcement, updated_at: now };
      return mockAnnouncements[idx];
    }
  }
  const created: Announcement = {
    id: `ann-${Date.now()}`,
    title: announcement.title,
    content: announcement.content,
    is_active: announcement.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  mockAnnouncements.unshift(created);
  return created;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) return true;
  }
  mockAnnouncements = mockAnnouncements.filter((a) => a.id !== id);
  return true;
}

// --- PROFIL ORGANISASI (ORGANIZATION PROFILE) ---
export async function getProfile(): Promise<OrganizationProfile> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('organization_profile')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (!error && data) return data as OrganizationProfile;
  }
  return { ...mockProfile };
}

export async function updateProfile(profile: Partial<OrganizationProfile>): Promise<OrganizationProfile> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('organization_profile')
      .upsert({ ...profile, id: 'default', updated_at: now })
      .select()
      .single();
    if (!error && data) return data as OrganizationProfile;
  }

  mockProfile = {
    ...mockProfile,
    ...profile,
    updated_at: now,
  };
  return { ...mockProfile };
}

// --- ANGGOTA & ALUMNI (MEMBERS) ---
export async function getMembers(): Promise<Member[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('class_year', { ascending: false });
    if (!error && data) return data as Member[];
  }
  return [...mockMembers];
}

export async function saveMember(member: Partial<Member> & { name: string; class_year: number; role: string }): Promise<Member> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabase) {
    if (member.id) {
      const { data, error } = await supabase
        .from('members')
        .update(member)
        .eq('id', member.id)
        .select()
        .single();
      if (!error && data) return data as Member;
    } else {
      const { data, error } = await supabase
        .from('members')
        .insert([{ ...member, created_at: now }])
        .select()
        .single();
      if (!error && data) return data as Member;
    }
  }

  if (member.id) {
    const idx = mockMembers.findIndex((m) => m.id === member.id);
    if (idx !== -1) {
      mockMembers[idx] = { ...mockMembers[idx], ...member };
      return mockMembers[idx];
    }
  }
  const created: Member = {
    id: `mem-${Date.now()}`,
    name: member.name,
    role: member.role,
    class_year: Number(member.class_year),
    is_alumni: member.is_alumni ?? false,
    photo_url: member.photo_url || '',
    contact_info: member.contact_info || '',
    instagram: member.instagram || '',
    created_at: now,
  };
  mockMembers.unshift(created);
  return created;
}

export async function deleteMember(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) return true;
  }
  mockMembers = mockMembers.filter((m) => m.id !== id);
  return true;
}

// --- PRESTASI (ACHIEVEMENTS) ---
export async function getAchievements(): Promise<Achievement[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });
    if (!error && data) return data as Achievement[];
  }
  return [...mockAchievements].sort((a, b) => b.year - a.year);
}

export async function saveAchievement(achievement: Partial<Achievement> & { title: string; recipient_name: string; year: number; level: Achievement['level'] }): Promise<Achievement> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabase) {
    if (achievement.id) {
      const { data, error } = await supabase
        .from('achievements')
        .update(achievement)
        .eq('id', achievement.id)
        .select()
        .single();
      if (!error && data) return data as Achievement;
    } else {
      const { data, error } = await supabase
        .from('achievements')
        .insert([{ ...achievement, created_at: now }])
        .select()
        .single();
      if (!error && data) return data as Achievement;
    }
  }

  if (achievement.id) {
    const idx = mockAchievements.findIndex((a) => a.id === achievement.id);
    if (idx !== -1) {
      mockAchievements[idx] = { ...mockAchievements[idx], ...achievement };
      return mockAchievements[idx];
    }
  }
  const created: Achievement = {
    id: `ach-${Date.now()}`,
    title: achievement.title,
    recipient_name: achievement.recipient_name,
    member_id: achievement.member_id,
    level: achievement.level,
    year: Number(achievement.year),
    certificate_url: achievement.certificate_url || '',
    description: achievement.description || '',
    created_at: now,
  };
  mockAchievements.unshift(created);
  return created;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (!error) return true;
  }
  mockAchievements = mockAchievements.filter((a) => a.id !== id);
  return true;
}

// --- KEGIATAN (EVENTS) ---
export async function getEvents(): Promise<EventItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    if (!error && data) return data as EventItem[];
  }
  return [...mockEvents];
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (!error && data) return data as EventItem;
  }
  return mockEvents.find((e) => e.slug === slug) || null;
}

export async function saveEvent(event: Partial<EventItem> & { title: string; event_date: string; location: string; status: EventItem['status'] }): Promise<EventItem> {
  const now = new Date().toISOString();
  // Auto-generate slug if not provided
  const slug = event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (isSupabaseConfigured() && supabase) {
    if (event.id) {
      const { data, error } = await supabase
        .from('events')
        .update({ ...event, slug })
        .eq('id', event.id)
        .select()
        .single();
      if (!error && data) return data as EventItem;
    } else {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...event, slug, created_at: now }])
        .select()
        .single();
      if (!error && data) return data as EventItem;
    }
  }

  if (event.id) {
    const idx = mockEvents.findIndex((e) => e.id === event.id);
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], ...event, slug };
      return mockEvents[idx];
    }
  }
  const created: EventItem = {
    id: `ev-${Date.now()}`,
    title: event.title,
    slug,
    event_date: event.event_date,
    time: event.time || '',
    location: event.location,
    status: event.status,
    summary: event.summary || '',
    description: event.description || '',
    cover_image_url: event.cover_image_url || '',
    gallery_urls: event.gallery_urls || [],
    created_at: now,
  };
  mockEvents.unshift(created);
  return created;
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) return true;
  }
  mockEvents = mockEvents.filter((e) => e.id !== id);
  return true;
}

// --- GALERI (GALLERY) ---
export async function getGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('year', { ascending: false });
    if (!error && data) return data as GalleryItem[];
  }
  return [...mockGallery].sort((a, b) => b.year - a.year);
}

export async function saveGalleryItem(item: Partial<GalleryItem> & { title: string; event_name: string; year: number; image_url: string }): Promise<GalleryItem> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured() && supabase) {
    if (item.id) {
      const { data, error } = await supabase
        .from('gallery')
        .update(item)
        .eq('id', item.id)
        .select()
        .single();
      if (!error && data) return data as GalleryItem;
    } else {
      const { data, error } = await supabase
        .from('gallery')
        .insert([{ ...item, created_at: now }])
        .select()
        .single();
      if (!error && data) return data as GalleryItem;
    }
  }

  if (item.id) {
    const idx = mockGallery.findIndex((g) => g.id === item.id);
    if (idx !== -1) {
      mockGallery[idx] = { ...mockGallery[idx], ...item };
      return mockGallery[idx];
    }
  }
  const created: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: item.title,
    event_name: item.event_name,
    year: Number(item.year),
    image_url: item.image_url,
    description: item.description || '',
    created_at: now,
  };
  mockGallery.unshift(created);
  return created;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) return true;
  }
  mockGallery = mockGallery.filter((g) => g.id !== id);
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
