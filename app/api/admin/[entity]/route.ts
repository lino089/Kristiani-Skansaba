import { NextRequest, NextResponse } from 'next/server';
import {
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  deleteAnnouncements,
  getProfile,
  updateProfile,
  getMembers,
  saveMember,
  deleteMember,
  deleteMembers,
  getAchievements,
  saveAchievement,
  deleteAchievement,
  deleteAchievements,
  getEvents,
  saveEvent,
  deleteEvent,
  deleteEvents,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  deleteGalleryItems,
} from '@/lib/data-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;

  switch (entity) {
    case 'announcements':
      return NextResponse.json(await getAnnouncements());
    case 'profile':
      return NextResponse.json(await getProfile());
    case 'members':
      return NextResponse.json(await getMembers());
    case 'achievements':
      return NextResponse.json(await getAchievements());
    case 'events':
      return NextResponse.json(await getEvents());
    case 'gallery':
      return NextResponse.json(await getGallery());
    default:
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  try {
    const body = await request.json();

    switch (entity) {
      case 'announcements': {
        const item = await saveAnnouncement(body);
        return NextResponse.json({ success: true, item });
      }
      case 'profile': {
        const item = await updateProfile(body);
        return NextResponse.json({ success: true, item });
      }
      case 'members': {
        const item = await saveMember(body);
        return NextResponse.json({ success: true, item });
      }
      case 'achievements': {
        const item = await saveAchievement(body);
        return NextResponse.json({ success: true, item });
      }
      case 'events': {
        const item = await saveEvent(body);
        return NextResponse.json({ success: true, item });
      }
      case 'gallery': {
        const item = await saveGalleryItem(body);
        return NextResponse.json({ success: true, item });
      }
      default:
        return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error saving ${entity}:`, error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Gagal menyimpan data.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  const { searchParams } = new URL(request.url);
  const singleId = searchParams.get('id');

  let ids: string[] = [];
  if (singleId) {
    ids = [singleId];
  } else {
    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        ids = body.ids.filter(Boolean);
      }
    } catch {
      // Body was not JSON
    }
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: 'ID tidak disertakan' }, { status: 400 });
  }

  try {
    let success = false;
    switch (entity) {
      case 'announcements':
        success = await deleteAnnouncements(ids);
        break;
      case 'members':
        success = await deleteMembers(ids);
        break;
      case 'achievements':
        success = await deleteAchievements(ids);
        break;
      case 'events':
        success = await deleteEvents(ids);
        break;
      case 'gallery':
        success = await deleteGalleryItems(ids);
        break;
      default:
        return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success, count: ids.length });
  } catch (error) {
    console.error(`Error deleting from ${entity}:`, error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus data.' },
      { status: 500 }
    );
  }
}
