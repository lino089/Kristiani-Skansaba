'use client';

import React, { useState } from 'react';
import { EventItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
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
      {/* Tabs Pemisah: Mendatang vs Selesai (PRD Modul 5) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-700 shadow-md shadow-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kegiatan Mendatang</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'upcoming'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {upcomingEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-blue-700 shadow-md shadow-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Kegiatan Selesai</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {completedEvents.length}
            </span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Acara */}
      {currentEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">
            Tidak ada {activeTab === 'upcoming' ? 'kegiatan mendatang' : 'dokumentasi kegiatan selesai'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Acara */}
                <div className="relative overflow-hidden bg-slate-100">
                  <OptimizedImage
                    src={event.cover_image_url}
                    alt={event.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                        event.status === 'upcoming'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-900/80 text-white backdrop-blur-xs'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </span>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
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
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {event.time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/kegiatan/${event.slug}`}>{event.title}</Link>
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed pt-1">
                    {event.summary || event.description}
                  </p>
                </div>
              </div>

              {/* Aksi Lihat Detail */}
              <div className="p-6 pt-0">
                <Link
                  href={`/kegiatan/${event.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <span>Lihat Detail &amp; Dokumentasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
