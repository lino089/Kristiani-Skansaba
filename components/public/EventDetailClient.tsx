'use client';

import React, { useState } from 'react';
import { EventItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface EventDetailClientProps {
  event: EventItem;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${event.title}*\nTanggal: ${new Date(event.event_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}\nLokasi: ${event.location}\n\nLihat selengkapnya di web resmi Kristiani Skansaba:\n`
    );
    window.open(`https://wa.me/?text=${text}${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="space-y-12">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          href="/kegiatan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#026AA2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Kegiatan</span>
        </Link>
      </div>

      {/* Header Detail Acara */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
              event.status === 'upcoming'
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shadow-xs'
                : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            {event.status === 'upcoming' ? 'Kegiatan Mendatang' : 'Kegiatan Selesai'}
          </span>
          <span className="text-xs text-[#64748B] font-medium">
            Dipublikasikan pada {new Date(event.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Bar Informasi Waktu & Lokasi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Tanggal Pelaksanaan</p>
              <p className="text-sm font-bold text-[#0F172A]">
                {new Date(event.event_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Waktu Acara</p>
              <p className="text-sm font-bold text-[#0F172A]">
                {event.time || 'Waktu Menyesuaikan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Lokasi Kegiatan</p>
              <p className="text-sm font-bold text-[#0F172A] line-clamp-1">
                {event.location}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image Utama */}
      <div className="rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-md bg-[#F1F5F9]">
        <OptimizedImage
          src={event.cover_image_url}
          alt={event.title}
          aspectRatio="16/9"
          priority={true}
          className="w-full h-auto"
        />
      </div>

      {/* Deskripsi Lengkap & Share Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
            Deskripsi &amp; Susunan Kegiatan
          </h2>
          <div className="prose prose-slate max-w-none text-[#475569] leading-relaxed text-base whitespace-pre-line">
            {event.description}
          </div>
        </div>

        {/* Sidebar Aksi & Informasi */}
        <div className="lg:col-span-4 space-y-6">
          {/* Share Box (WhatsApp / Copy Link) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#026AA2]" />
              <span>Bagikan Informasi Acara</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Sebarkan kabar baik dan ajak rekan-rekan untuk turut hadir dalam kegiatan ini.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2 focus-visible:outline-hidden cursor-pointer"
              >
                <span>Bagikan ke WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#334155] bg-white hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0] shadow-xs focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 focus-visible:outline-hidden cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#15803D]" />
                    <span>Tautan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#64748B]" />
                    <span>Salin Tautan Halaman</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galeri Dokumentasi Terkait Acara (PRD Modul 5) */}
      {event.gallery_urls && event.gallery_urls.length > 0 && (
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Galeri Dokumentasi Kegiatan
              </h2>
              <p className="text-xs text-[#64748B]">
                Foto-foto momen yang terekam selama acara berlangsung.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {event.gallery_urls.map((photoUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photoUrl)}
                className="relative cursor-pointer rounded-2xl overflow-hidden border border-[#E2E8F0] group aspect-square bg-[#F1F5F9]"
              >
                <OptimizedImage
                  src={photoUrl}
                  alt={`${event.title} - Foto ${idx + 1}`}
                  aspectRatio="1/1"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  <span>Perbesar Foto</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Pratinjau Foto */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup Pratinjau (Escape)"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto}
              alt="Dokumentasi Acara"
              className="max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </article>
  );
}
