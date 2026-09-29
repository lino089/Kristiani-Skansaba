import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Trophy,
  Bell,
  Info,
  Camera,
} from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import {
  getProfile,
  getActiveAnnouncement,
  getEvents,
  getAchievements,
  getGallery,
} from '@/lib/data-store';

export default async function HomePage() {
  const [profile, activeAnnouncement, allEvents, achievements, gallery] =
    await Promise.all([
      getProfile(),
      getActiveAnnouncement(),
      getEvents(),
      getAchievements(),
      getGallery(),
    ]);

  // Modul 1: Filter 3 kegiatan mendatang, atau beralih ke dokumentasi terakhir jika kosong
  const upcomingEvents = allEvents
    .filter((e) => e.status === 'upcoming')
    .slice(0, 3);
  const completedEventsFallback = allEvents
    .filter((e) => e.status === 'completed')
    .slice(0, 3);
  const displayEvents =
    upcomingEvents.length > 0 ? upcomingEvents : completedEventsFallback;
  const isFallbackEvent = upcomingEvents.length === 0;

  // Modul 1: Sorotan 3 prestasi terbaru
  const latestAchievements = achievements.slice(0, 3);

  // Cuplikan 4 foto galeri
  const previewGallery = gallery.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION (FULL-BLEED BACKGROUND WITH KRISTIANISKANSABA.WEBP) */}
      <section className="relative overflow-hidden text-white -mt-[105px] pt-[140px] sm:pt-[170px] pb-20 sm:pb-28 lg:pb-32 border-b border-white/10 min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center">
        {/* Full-bleed background image with Next.js Image */}
        <div className="absolute inset-0 -z-20 select-none">
          <Image
            src="/Kristianiskansaba.webp"
            alt="Persekutuan Siswa Kristiani SMK Negeri 1 Bantul"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </div>

        {/* Deep Forest Multi-stop Gradient Overlay from Photo Palette (softer and more organic) */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0D190C]/75 via-[#0D190C]/45 to-[#0D190C]/80 pointer-events-none"
          aria-hidden="true"
        />

        {/* Atmospheric Subtle Radiant Glow */}
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.08)_0%,transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Center-aligned Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto pt-4 pb-4 space-y-6 sm:space-y-8">
          {/* Big Centered Headline with Soft Pastel Accent */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Bertumbuh Bersama Dalam{' '}
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-[#BAE6FD] to-amber-100 drop-shadow-xs">
              Iman, Kasih, &amp; Karakter
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto font-normal">
            {profile.vision ||
              'Menjadi wadah persekutuan siswa Kristiani yang berakar kuat dalam iman, bertumbuh dalam kasih persaudaraan, serta berbuah nyata dalam karakter, integritas, dan prestasi bagi kemuliaan Tuhan dan almamater Skansaba.'}
          </p>

          {/* CTA Buttons with Softer Radius (rounded-full) and Gentle Tones */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href="/kegiatan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-[#026AA2] hover:bg-[#025785] shadow-md shadow-black/20 hover:shadow-lg transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <Calendar className="w-5 h-5 text-white" />
              <span>Jelajahi Agenda Kegiatan</span>
            </Link>
            <Link
              href="/profil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white/90 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-xs transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <Info className="w-5 h-5 text-white/90" />
              <span>Mengenal Persekutuan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PENGUMUMAN DINAMIS (JIKA AKTIF) */}
      {activeAnnouncement && (
        <section id="pengumuman" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 lg:-mt-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] flex-shrink-0 shadow-xs">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full">
                      Pengumuman Terbaru
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {new Date(activeAnnouncement.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1.5">
                    {activeAnnouncement.title}
                  </h2>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed whitespace-pre-line">
                    {activeAnnouncement.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. AGENDA KEGIATAN MENDATANG (3 KARTU DENGAN KRITERIA PENERIMAAN PRD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isFallbackEvent ? 'Dokumentasi Terakhir' : 'Agenda Terbaru'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {isFallbackEvent ? 'Dokumentasi Kegiatan Terkini' : 'Kegiatan Mendatang'}
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              {isFallbackEvent
                ? 'Saat ini belum ada kegiatan mendatang. Berikut arsip kegiatan yang baru saja terlaksana.'
                : 'Ikuti persekutuan, ibadah, dan acara rohani Kristiani Skansaba.'}
            </p>
          </div>
          <Link
            href="/kegiatan"
            className="mt-4 sm:mt-0 text-sm font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-sm transition-all"
          >
            Lihat Semua Kegiatan
          </Link>
        </div>

        {displayEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#E2E8F0] text-[#64748B] shadow-xs">
            <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="font-semibold text-[#0F172A]">Belum ada agenda kegiatan yang dipublikasikan.</p>
            <p className="text-xs text-[#64748B] mt-1">Silakan kunjungi halaman ini kembali dalam beberapa waktu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col group"
              >
                <div className="relative">
                  <OptimizedImage
                    src={event.cover_image_url}
                    alt={event.title}
                    aspectRatio="16/9"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        event.status === 'upcoming'
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shadow-xs'
                          : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#64748B] mb-2">
                      <span className="flex items-center gap-1 font-semibold text-[#026AA2]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.event_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                        {event.location.split(',')[0]}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-[#0F172A] line-clamp-2 group-hover:text-[#026AA2] transition-colors">
                      <Link href={`/kegiatan/${event.slug}`}>{event.title}</Link>
                    </h3>

                    <p className="text-sm text-[#475569] mt-2 line-clamp-3 leading-relaxed">
                      {event.summary || event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <Link
                      href={`/kegiatan/${event.slug}`}
                      className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs transition-all"
                    >
                      Lihat Detail Acara
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. SOROTAN PRESTASI TERBARU (3 KARTU DENGAN KRITERIA PRD) */}
      <section className="bg-[#EAEFEA]/50 py-16 border-y border-[#DCE4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#DCE4DD]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Capaian Membanggakan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Sorotan Prestasi Siswa
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Apresiasi talenta dan kerja keras siswa Kristiani di berbagai kejuaraan.
              </p>
            </div>
            <Link
              href="/prestasi"
              className="mt-4 sm:mt-0 text-sm font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-sm transition-all"
            >
              Semua Arsip Prestasi
            </Link>
          </div>

          {latestAchievements.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-[#E2E8F0] shadow-xs">
              <Trophy className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <p className="font-semibold text-[#0F172A]">Belum ada data prestasi yang ditampilkan.</p>
              <p className="text-xs text-[#64748B] mt-1">
                Dokumentasi capaian dan penghargaan siswa akan diperbarui secara berkala.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {latestAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                        <Trophy className="w-3.5 h-3.5" />
                        Tingkat {ach.level}
                      </span>
                      <span className="text-xs font-semibold text-[#64748B]">
                        Tahun {ach.year}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#026AA2] transition-colors">
                      {ach.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] font-bold text-xs">
                        {ach.recipient_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B]">Penerima:</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{ach.recipient_name}</p>
                      </div>
                    </div>

                    {ach.description && (
                      <p className="text-xs text-[#475569] mt-3 line-clamp-2 leading-relaxed">
                        {ach.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                    <Link
                      href="/prestasi"
                      className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs transition-all"
                    >
                      Lihat Bukti Piagam
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. CUPLIKAN GALERI MULTIMEDIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Dokumentasi Visual</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Momen &amp; Kenangan Bersama
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Kilas balik perayaan hari besar keagamaan, retret, ibadah padang, dan bakti sosial.
            </p>
          </div>
          <Link
            href="/galeri"
            className="mt-4 sm:mt-0 text-sm font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-sm transition-all"
          >
            Buka Seluruh Galeri
          </Link>
        </div>

        {previewGallery.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#E2E8F0] shadow-xs">
            <Camera className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="font-semibold text-[#0F172A]">Belum ada dokumentasi foto dalam galeri.</p>
            <p className="text-xs text-[#64748B] mt-1">
              Arsip foto perayaan, ibadah bersama, dan kegiatan kebersamaan akan segera diunggah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewGallery.map((item) => (
              <Link
                key={item.id}
                href="/galeri"
                className="group relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs block focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden"
              >
                <OptimizedImage
                  src={item.image_url}
                  alt={item.title}
                  aspectRatio="1/1"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-semibold text-[#BAE6FD]">
                    {item.year} • {item.event_name}
                  </span>
                  <p className="text-xs font-bold truncate">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
