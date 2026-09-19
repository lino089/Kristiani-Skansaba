'use client';

import React, { useState, useMemo } from 'react';
import { GalleryItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GalleryClientProps {
  initialGallery: GalleryItem[];
}

export default function GalleryClient({ initialGallery }: GalleryClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract distinct years and event names
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialGallery.map((g) => g.year)));
    return years.sort((a, b) => b - a);
  }, [initialGallery]);

  const availableEvents = useMemo(() => {
    const events = Array.from(new Set(initialGallery.map((g) => g.event_name)));
    return events;
  }, [initialGallery]);

  // Reactive filtering
  const filtered = useMemo(() => {
    return initialGallery.filter((item) => {
      const matchYear =
        selectedYear === 'all' || item.year.toString() === selectedYear;
      const matchEvent =
        selectedEvent === 'all' || item.event_name === selectedEvent;
      return matchYear && matchEvent;
    });
  }, [initialGallery, selectedYear, selectedEvent]);

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  };
  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tahun */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Tahun:
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedYear === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Tahun
          </button>
          {availableYears.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year.toString())}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedYear === year.toString()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Filter Acara */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
            Acara:
          </span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full md:w-64 px-3 py-1.5 rounded-lg text-xs border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="all">Semua Jenis Acara</option>
            {availableEvents.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Galeri (PRD Modul 6: Tata letak kisi masonry/grid responsif + Lazy Loading) */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">Tidak ada foto dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs hover:shadow-md transition-all"
            >
              <OptimizedImage
                src={item.image_url}
                alt={item.title}
                aspectRatio="4/3"
                priority={idx < 3}
                className="group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between text-xs text-blue-300 font-semibold mb-1">
                  <span>{item.event_name}</span>
                  <span>{item.year}</span>
                </div>
                <h3 className="font-bold text-base leading-snug line-clamp-1">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-light">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Klik untuk perbesar</span>
                </div>
              </div>

              {/* Badges pojok atas */}
              <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-0 transition-opacity">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900/70 text-white backdrop-blur-xs">
                  {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL LAYAR PENUH (PRD Modul 6) */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Tombol Navigasi Sebelumnya */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Foto Sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Tombol Navigasi Berikutnya */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Foto Berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Tutup Lightbox"
            className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Container Konten Gambar Lightbox */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {/* Keterangan Foto */}
            <div className="text-center text-white max-w-xl px-4 space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300">
                <span>{currentItem.event_name}</span>
                <span>•</span>
                <span>Tahun {currentItem.year}</span>
              </div>
              <h3 className="font-bold text-lg">{currentItem.title}</h3>
              {currentItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
