import React from 'react';
import type { Metadata } from 'next';
import {
  BookOpen,
  Target,
  Compass,
  Users,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getProfile } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Profil Persekutuan & Nilai Bersama',
  description:
    'Sejarah perjalanan, nilai & semangat kebersamaan, serta guru pembina dan koordinator kegiatan siswa Kristiani SMK Negeri 1 Bantul.',
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
        <p className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-2">
          Tentang Persekutuan
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Mengenal Persekutuan Siswa Kristiani
        </h1>
        <p className="text-base text-[#475569] mt-3 leading-relaxed">
          Keluarga rohani siswa-siswi Kristen dan Katolik di {profile.school_name} yang saling mendukung dalam doa, melayani dengan sukacita, dan bertumbuh bersama.
        </p>
      </section>

      {/* Sejarah & Latar Belakang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#026AA2] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Rekam Jejak Sejarah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              Perjalanan Kasih &amp; Pelayanan di Skansaba
            </h2>
            <div className="text-[#475569] text-sm sm:text-base leading-relaxed space-y-3">
              <p>{profile.history}</p>
              <p>
                Melalui bimbingan penuh kasih dari guru pembina dan semangat persaudaraan antarsiswa, persekutuan ini senantiasa menjadi rumah kedua bagi setiap siswa Kristen dan Katolik untuk memperdalam iman, saling mendoakan, dan menyalurkan talenta pelayanan.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E2E8F0] group">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                alt="Kebersamaan Persekutuan Siswa Kristiani"
                aspectRatio="16/9"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent flex items-end p-6 text-white">
                <p className="text-sm font-medium italic">
                  &ldquo;Sehati sepikir, dalam satu kasih, satu jiwa, satu tujuan.&rdquo; (Filipi 2:2)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-[#EAEFEA]/50 py-16 border-y border-[#DCE4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Visi */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#025F98] via-[#027AB6] to-[#1B7C4F] text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-6 backdrop-blur-xs">
                  <Target className="w-6 h-6 text-[#BAE6FD]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#BAE6FD]">
                  Nilai &amp; Semangat Bersama
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2 leading-snug">
                  Semangat Kasih &amp; Persaudaraan
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed mt-6 italic font-light">
                  &ldquo;{profile.vision}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-2 text-xs text-[#BAE6FD]">
                <Shield className="w-4 h-4" />
                <span>Dasar Persekutuan &amp; Saling Mendoakan</span>
              </div>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] mb-6 shadow-2xs">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#026AA2]">
                  Wujud Nyata Pelayanan
                </span>
                <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">
                  Langkah Saling Mendukung
                </h3>
                <ul className="mt-6 space-y-4">
                  {profile.mission.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-[#475569] text-sm sm:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F1F5F9] flex items-center gap-2 text-xs text-[#64748B]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Terus dihidupi bersama dalam kehidupan sehari-hari di sekolah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guru Pembina & Koordinator Kegiatan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-2">
            <Users className="w-4 h-4" />
            <span>Pembina &amp; Koordinator Kegiatan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Guru Pembina &amp; Koordinator Siswa
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Bapak/Ibu Guru Pembina Agama dan siswa narahubung/PIC pelayanan kegiatan di SMK Negeri 1 Bantul.
          </p>
        </div>

        <div className="space-y-12">
          {/* Level 1: Dewan Pembina */}
          {pembina.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
                  Guru Pembina Agama Kristen &amp; Katolik
                </span>
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
              </div>

              <div className="flex justify-center">
                {pembina.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs max-w-sm w-full text-center group hover:border-[#0284C7]/40 hover:shadow-md transition-all"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-[#DCFCE7] shadow-xs">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-[#0F172A]">{item.name}</h3>
                    <p className="text-xs font-bold text-[#026AA2] uppercase tracking-wider mt-0.5">
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
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
                  Koordinator Siswa &amp; Narahubung Kegiatan
                </span>
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {inti.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs text-center group hover:border-[#0284C7]/40 hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-[#DCFCE7] shadow-xs">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A]">{item.name}</h3>
                    <span className="inline-block px-2.5 py-0.5 mt-1.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
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
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
                  Tim Pendukung / PIC Kegiatan (Ibadah, Natal, Paskah, Musik)
                </span>
                <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {divisi.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs text-center group hover:border-[#0284C7]/40 hover:shadow-md transition-all"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 ring-2 ring-[#E2E8F0] shadow-xs">
                      <OptimizedImage
                        src={item.photo_url}
                        alt={item.name}
                        aspectRatio="1/1"
                        isAvatar={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-sm text-[#0F172A]">{item.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{item.division || item.role}</p>
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
