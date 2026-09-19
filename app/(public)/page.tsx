import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Bell,
  Heart,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Info,
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
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Background Overlay Texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Komunitas Rohani Resmi • SMK Negeri 1 Bantul</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Bertumbuh Bersama Dalam{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Iman, Kasih, &amp; Karakter
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {profile.vision ||
                  'Wadah persekutuan siswa Kristiani yang berakar dalam iman, bertumbuh dalam kasih persaudaraan, serta berbuah nyata bagi kemuliaan Tuhan dan almamater Skansaba.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/kegiatan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Jelajahi Agenda Kegiatan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/profil"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:text-white transition-all"
                >
                  <Info className="w-5 h-5" />
                  <span>Tentang Komunitas</span>
                </Link>
              </div>

              {/* Stat badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Kekeluargaan</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">18+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tahun Berdiri</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-sky-400">Aktif</p>
                  <p className="text-xs text-slate-400 mt-0.5">Setiap Minggu</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10 group">
                  <OptimizedImage
                    src={allEvents[0]?.cover_image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'}
                    alt="Komunitas Siswa Kristiani Skansaba"
                    aspectRatio="4/3"
                    priority={true}
                    className="group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-blue-600 rounded-full inline-block mb-1.5">
                        Dokumentasi Resmi
                      </span>
                      <h3 className="font-bold text-base sm:text-lg">
                        {allEvents[0]?.title || 'Persekutuan Siswa Kristiani'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>SMK Negeri 1 Bantul</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Etalase Prestasi</p>
                    <p className="text-sm font-bold text-slate-900">{achievements.length} Capaian Juara</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PENGUMUMAN DINAMIS (JIKA AKTIF) */}
      {activeAnnouncement && (
        <section id="pengumuman" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 lg:-mt-12 relative z-10">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100 ring-1 ring-blue-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-500/30">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Pengumuman Terbaru
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(activeAnnouncement.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    {activeAnnouncement.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isFallbackEvent ? 'Dokumentasi Terakhir' : 'Agenda Terbaru'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isFallbackEvent ? 'Dokumentasi Kegiatan Terkini' : 'Kegiatan Mendatang'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isFallbackEvent
                ? 'Saat ini belum ada kegiatan mendatang. Berikut arsip kegiatan yang baru saja terlaksana.'
                : 'Ikuti persekutuan, ibadah, dan acara rohani Kristiani Skansaba.'}
            </p>
          </div>
          <Link
            href="/kegiatan"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            <span>Lihat Semua Kegiatan</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">Belum ada agenda kegiatan yang dipublikasikan.</p>
            <p className="text-xs text-slate-400 mt-1">Silakan kunjungi halaman ini kembali dalam beberapa waktu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
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
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        event.status === 'upcoming'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1 font-medium text-blue-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.event_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.location.split(',')[0]}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/kegiatan/${event.slug}`}>{event.title}</Link>
                    </h3>

                    <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {event.summary || event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/kegiatan/${event.slug}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Lihat Detail Acara</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. SOROTAN PRESTASI TERBARU (3 KARTU DENGAN KRITERIA PRD) */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Capaian Membanggakan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sorotan Prestasi Anggota
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Apresiasi talenta dan kerja keras siswa Kristiani di berbagai kejuaraan.
              </p>
            </div>
            <Link
              href="/prestasi"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 group"
            >
              <span>Semua Arsip Prestasi</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {latestAchievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Trophy className="w-3.5 h-3.5" />
                      Tingkat {ach.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Tahun {ach.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {ach.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {ach.recipient_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Penerima:</p>
                      <p className="text-sm font-semibold text-slate-800">{ach.recipient_name}</p>
                    </div>
                  </div>

                  {ach.description && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/prestasi"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Lihat Dokumentasi Bukti Piagam</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NILAI & PILAR KOMUNITAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Pondasi Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Tiga Pilar Karakter Siswa Kristiani
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Membangun generasi muda yang berintegritas tinggi dalam kehidupan sehari-hari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-xs">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Kasih yang Tulus</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menerapkan cinta kasih tanpa membeda-bedakan, mengutamakan saling menghargai dan mendukung dalam keluarga besar sekolah.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Persekutuan yang Hangat</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mewadahi ruang doa dan saling mendoakan, belajar firman bersama, dan menguatkan saat menghadapi tantangan studi.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Pelayanan &amp; Prestasi</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mengembangkan potensi bakat untuk melayani sesama serta mengharumkan nama Tuhan dan SMK Negeri 1 Bantul.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CUPLIKAN GALERI MULTIMEDIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dokumentasi Visual</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Momen &amp; Kenangan Bersama
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kilas balik perayaan hari besar keagamaan, retret, ibadah padang, dan bakti sosial.
            </p>
          </div>
          <Link
            href="/galeri"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            <span>Buka Seluruh Galeri</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewGallery.map((item) => (
            <Link
              key={item.id}
              href="/galeri"
              className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-xs block"
            >
              <OptimizedImage
                src={item.image_url}
                alt={item.title}
                aspectRatio="1/1"
                className="group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-semibold text-blue-300">
                  {item.year} • {item.event_name}
                </span>
                <p className="text-xs font-bold truncate">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
