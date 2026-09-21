'use client';

import React, { useState } from 'react';
import { EventItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface EventsClientProps {
  events: EventItem[];
}

export default function EventsClient({ events }: EventsClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const completedEvents = events.filter((e) => e.status === 'completed');

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : completedEvents;

  return (
    <div className="space-y-8">
      {/* Tab Switcher: Mendatang vs Selesai (PRD Modul 4) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-white text-[#026AA2] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kegiatan Mendatang</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'upcoming'
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              {upcomingEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-[#026AA2] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Kegiatan Selesai</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'completed'
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              {completedEvents.length}
            </span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Acara */}
      {currentEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] shadow-xs">
          <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="font-bold text-[#0F172A] text-base">
            Tidak ada {activeTab === 'upcoming' ? 'kegiatan mendatang' : 'dokumentasi kegiatan selesai'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'Seluruh agenda saat ini telah terlaksana. Pantau terus pengumuman untuk jadwal kegiatan baru.'
              : 'Belum ada arsip kegiatan selesai dalam sistem.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentEvents.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Acara */}
                <div className="relative overflow-hidden bg-[#F1F5F9]">
                  <OptimizedImage
                    src={event.cover_image_url}
                    alt={event.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                        event.status === 'upcoming'
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                          : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </span>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-semibold text-[#026AA2]">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.event_date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                        {event.time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#026AA2] transition-colors line-clamp-2">
                    <Link href={`/kegiatan/${event.slug}`}>{event.title}</Link>
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-[#64748B]">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <p className="text-sm text-[#475569] line-clamp-3 leading-relaxed pt-1">
                    {event.summary || event.description}
                  </p>
                </div>
              </div>

              {/* Aksi Lihat Detail */}
              <div className="p-6 pt-0">
                <Link
                  href={`/kegiatan/${event.slug}`}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-[#026AA2] bg-[#E0F2FE] hover:bg-[#0284C7] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden"
                >
                  <span>Lihat Detail &amp; Dokumentasi</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
