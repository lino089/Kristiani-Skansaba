import React from 'react';
import type { Metadata } from 'next';
import {
  BookOpen,
  Target,
  Compass,
  Users,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getProfile } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Profil & Struktur Organisasi',
  description:
    'Sejarah perjalanan, visi, misi, dan bagan visual struktur kepengurusan Komunitas Siswa Kristiani SMK Negeri 1 Bantul.',
};

export default async function ProfilPage() {
  const profile = await getProfile();

  const pembina = profile.structure.filter((s) => s.level === 'pembina');
  const inti = profile.structure.filter((s) => s.level === 'inti');
  const divisi = profile.structure.filter((s) => s.level === 'divisi');

  return (
    <div className="py-12 lg:py-16 space-y-16 lg:space-y-24">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tentang Komunitas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mengenal Komunitas Siswa Kristiani
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Membangun keluarga rohani di lingkungan {profile.school_name} yang saling mendukung, melayani, dan berprestasi bersama.
        </p>
      </section>

      {/* Sejarah & Latar Belakang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Rekam Jejak Sejarah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Perjalanan Kasih &amp; Pelayanan di Skansaba
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
              <p>{profile.history}</p>
              <p>
                Melalui komitmen guru pembina dan estafet kepemimpinan antargenerasi, komunitas ini senantiasa menjadi rumah kedua bagi setiap siswa untuk memperdalam iman dan menyalurkan talenta pelayanan.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                alt="Kebersamaan Komunitas Siswa Kristiani"
                aspectRatio="16/9"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 text-white">
                <p className="text-sm font-medium italic">
                  &ldquo;Sehati sepikir, dalam satu kasih, satu jiwa, satu tujuan.&rdquo; — Filipi 2:2
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Visi */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-xs">
                  <Target className="w-6 h-6 text-blue-200" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Visi Organisasi
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 leading-snug">
                  Arah &amp; Cita-cita Komunitas
                </h3>
                <p className="text-blue-100 text-base sm:text-lg leading-relaxed mt-6 italic font-light">
                  &ldquo;{profile.vision}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-2 text-xs text-blue-200">
                <Shield className="w-4 h-4" />
                <span>Pedoman Dasar Pembinaan Karakter Kristiani</span>
              </div>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Misi Strategis
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Langkah Nyata Mencapai Visi
                </h3>
                <ul className="mt-6 space-y-4">
                  {profile.mission.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Terus dievaluasi dan diwujudkan secara berkala</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagan Visual Struktur Organisasi (Modul 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <Users className="w-4 h-4" />
            <span>Struktur Kepengurusan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Susunan Pengurus Aktif
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bagan kepemimpinan dan pelayanan masa bakti saat ini di SMK Negeri 1 Bantul.
          </p>
        </div>

        <div className="space-y-12">
          {/* Level 1: Dewan Pembina */}
          {pembina.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Guru Pembina Rohani
                </span>
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
              </div>

              <div className="flex justify-center">
                {pembina.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full text-center group hover:border-blue-300 transition-all"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-blue-50 shadow-md">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                      {item.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 2: Pengurus Inti */}
          {inti.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Badan Pengurus Harian (BPH)
                </span>
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {inti.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center group hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-blue-50 shadow-xs">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                    <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {item.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Koordinator Divisi */}
          {divisi.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Koordinator Divisi &amp; Pelayanan
                </span>
                <span className="h-px bg-slate-200 flex-1 max-w-xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {divisi.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center group hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 ring-2 ring-slate-100 shadow-xs">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.division || item.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
