import React from 'react';
import type { Metadata } from 'next';
import { getEvents } from '@/lib/data-store';
import EventsClient from '@/components/public/EventsClient';

export const metadata: Metadata = {
  title: 'Jadwal & Dokumentasi Kegiatan',
  description:
    'Jadwal peribadatan bersama, perayaan hari besar gerejawi (Natal & Paskah), retret, dan arsip dokumentasi siswa Kristiani SMK Negeri 1 Bantul.',
};

export default async function KegiatanPage() {
  const events = await getEvents();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-2">
          Agenda &amp; Rekam Jejak
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Jadwal &amp; Dokumentasi Kegiatan
        </h1>
        <p className="text-base text-[#475569] mt-3 leading-relaxed">
          Jadwal ibadah bersama, perayaan hari besar keagamaan (Natal dan Paskah), retret pembinaan, serta arsip dokumentasi momen kebersamaan siswa Kristiani.
        </p>
      </div>

      {/* Client Tab & Events Display */}
      <EventsClient events={events} />
    </div>
  );
}
