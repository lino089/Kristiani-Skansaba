import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import {
  INITIAL_PROFILE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MEMBERS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
} from '../lib/seed-data';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log('🚀 Starting Supabase initial seeding for Persekutuan Siswa Kristiani Skansaba...');

  // 1. Organization Profile
  console.log('1. Checking organization_profile...');
  const { data: existingProfile } = await supabase.from('organization_profile').select('id').limit(1);
  if (!existingProfile || existingProfile.length === 0) {
    const { error: profError } = await supabase.from('organization_profile').upsert({
      id: 'default',
      name: INITIAL_PROFILE.name,
      school_name: INITIAL_PROFILE.school_name,
      history: INITIAL_PROFILE.history,
      vision: INITIAL_PROFILE.vision,
      mission: INITIAL_PROFILE.mission,
      structure: INITIAL_PROFILE.structure,
      updated_at: new Date().toISOString(),
    });
    if (profError) {
      console.error('Error inserting organization_profile:', profError.message);
    } else {
      console.log('✅ organization_profile seeded.');
    }
  } else {
    console.log('ℹ️ organization_profile already has data. Skipping.');
  }

  // 2. Announcements
  console.log('2. Checking announcements...');
  const { data: existingAnn } = await supabase.from('announcements').select('id').limit(1);
  if (!existingAnn || existingAnn.length === 0) {
    const announcementsToInsert = INITIAL_ANNOUNCEMENTS.map((item) => {
      const copy = { ...item };
      delete (copy as Record<string, unknown>).id;
      return copy;
    });
    const { error: annError } = await supabase.from('announcements').insert(announcementsToInsert);
    if (annError) {
      console.error('Error inserting announcements:', annError.message);
    } else {
      console.log(`✅ announcements seeded (${announcementsToInsert.length} items).`);
    }
  } else {
    console.log('ℹ️ announcements already has data. Skipping.');
  }

  // 3. Members
  console.log('3. Checking members...');
  const { data: existingMembers } = await supabase.from('members').select('id').limit(1);
  if (!existingMembers || existingMembers.length === 0) {
    const membersToInsert = INITIAL_MEMBERS.map((item) => {
      const copy = { ...item };
      delete (copy as Record<string, unknown>).id;
      return copy;
    });
    const { error: memError } = await supabase.from('members').insert(membersToInsert);
    if (memError) {
      console.error('Error inserting members:', memError.message);
    } else {
      console.log(`✅ members seeded (${membersToInsert.length} items).`);
    }
  } else {
    console.log('ℹ️ members already has data. Skipping.');
  }

  // 4. Achievements
  console.log('4. Checking achievements...');
  const { data: existingAch } = await supabase.from('achievements').select('id').limit(1);
  if (!existingAch || existingAch.length === 0) {
    const achievementsToInsert = INITIAL_ACHIEVEMENTS.map((item) => {
      const copy = { ...item };
      delete (copy as Record<string, unknown>).id;
      copy.member_id = undefined;
      return copy;
    });
    const { error: achError } = await supabase.from('achievements').insert(achievementsToInsert);
    if (achError) {
      console.error('Error inserting achievements:', achError.message);
    } else {
      console.log(`✅ achievements seeded (${achievementsToInsert.length} items).`);
    }
  } else {
    console.log('ℹ️ achievements already has data. Skipping.');
  }

  // 5. Events
  console.log('5. Checking events...');
  const { data: existingEvents } = await supabase.from('events').select('id').limit(1);
  if (!existingEvents || existingEvents.length === 0) {
    const eventsToInsert = INITIAL_EVENTS.map((item) => {
      const copy = { ...item };
      delete (copy as Record<string, unknown>).id;
      return copy;
    });
    const { error: evError } = await supabase.from('events').insert(eventsToInsert);
    if (evError) {
      console.error('Error inserting events:', evError.message);
    } else {
      console.log(`✅ events seeded (${eventsToInsert.length} items).`);
    }
  } else {
    console.log('ℹ️ events already has data. Skipping.');
  }

  // 6. Gallery
  console.log('6. Checking gallery...');
  const { data: existingGal } = await supabase.from('gallery').select('id').limit(1);
  if (!existingGal || existingGal.length === 0) {
    const galleryToInsert = INITIAL_GALLERY.map((item) => {
      const copy = { ...item };
      delete (copy as Record<string, unknown>).id;
      return copy;
    });
    const { error: galError } = await supabase.from('gallery').insert(galleryToInsert);
    if (galError) {
      console.error('Error inserting gallery:', galError.message);
    } else {
      console.log(`✅ gallery seeded (${galleryToInsert.length} items).`);
    }
  } else {
    console.log('ℹ️ gallery already has data. Skipping.');
  }

  console.log('🎉 Seeding process completed successfully!');
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
