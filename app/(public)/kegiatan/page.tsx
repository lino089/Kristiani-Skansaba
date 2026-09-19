import React from 'react';
import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import { getEvents } from '@/lib/data-store';
import EventsClient from '@/components/public/EventsClient';

export const metadata: Metadata = {
  title: 'Agenda & Dokumentasi Kegiatan',
  description:
    'Jadwal ibadah, retret, perayaan hari besar, dan dokumentasi kegiatan Komunitas Siswa Kristiani SMK Negeri 1 Bantul.',
};

export default async function KegiatanPage() {
  const events = await getEvents();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda &amp; Rekam Jejak</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kegiatan &amp; Dokumentasi Acara
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Temukan jadwal kegiatan kerohanian yang akan datang serta arsip dokumentasi momen kebersamaan yang telah berlangsung.
        </p>
      </div>

      {/* Client Tab & Events Display */}
      <EventsClient events={events} />
    </div>
  );
}
