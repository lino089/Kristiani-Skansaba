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
import { getProfile, getMembers } from '@/lib/data-store';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Profil Persekutuan & Nilai Bersama',
  description:
    'Sejarah perjalanan, nilai & semangat kebersamaan, serta guru pembina dan koordinator kegiatan siswa Kristiani SMK Negeri 1 Bantul.',
};

export default async function ProfilPage() {
  const [profile, members] = await Promise.all([getProfile(), getMembers()]);

  const guruList = (profile.structure || []).filter(
    (s) => s.level === 'pembina' || s.level === 'guru'
  );
  // Siswa diambil langsung dari data Siswa & Alumni
  const activeStudents = members.filter((m) => !m.is_alumni);
  const displayStudents = activeStudents.length > 0 ? activeStudents : members;

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
            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0]">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop&q=80"
                alt="Kebersamaan Siswa Kristiani Skansaba"
                aspectRatio="16/9"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nilai & Semangat Bersama (Substitusi Visi Misi Kaku) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#15803D] mb-2">
            <Target className="w-4 h-4" />
            <span>Nilai &amp; Semangat Bersama</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Semangat Persaudaraan &amp; Karakter Kristiani
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Prinsip kasih persaudaraan dan keteladanan yang kami hidupi bersama di lingkungan sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Nilai Dasar / Semangat Kasih */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Semangat Kasih &amp; Persaudaraan
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {profile.vision}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center gap-3 text-xs text-[#64748B]">
              <Shield className="w-4 h-4 text-[#15803D]" />
              <span>Mencerminkan karakter Kristus dalam perkataan dan perbuatan.</span>
            </div>
          </div>

          {/* Wujud Nyata / Praktik Bersama */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#026AA2]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Wujud Nyata Semangat &amp; Pelayanan
                </h3>
                <p className="text-xs text-[#64748B]">
                  Langkah nyata saling mendukung dan menjaga kebersamaan
                </p>
              </div>
            </div>

            {profile.mission.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Belum ada butir wujud nyata pelayanan yang dicantumkan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {profile.mission.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80 hover:bg-[#F0FDF4] hover:border-[#BBF7D0] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Daftar Guru & Siswa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-2">
            <Users className="w-4 h-4" />
            <span>Guru &amp; Siswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Daftar Guru &amp; Siswa
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Bapak/Ibu Guru Pembina Agama dan siswa-siswi persekutuan Kristiani di SMK Negeri 1 Bantul.
          </p>
        </div>

        <div className="space-y-12">
          {/* Bagian 1: Daftar Guru */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#026AA2]">
                Daftar Guru
              </span>
              <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
            </div>

            {guruList.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-[#E2E8F0] shadow-xs max-w-md mx-auto text-[#64748B]">
                <p className="text-xs">Belum ada data guru pembina yang terdaftar.</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {guruList.map((item) => (
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
                    <p className="text-xs font-bold text-[#026AA2] uppercase tracking-wider mt-1">
                      {item.role || 'Guru Pembina Agama'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bagian 2: Daftar Siswa */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#15803D]">
                Daftar Siswa
              </span>
              <span className="h-px bg-[#E2E8F0] flex-1 max-w-xs" />
            </div>

            {displayStudents.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-[#E2E8F0] shadow-xs max-w-md mx-auto text-[#64748B]">
                <p className="text-xs">Belum ada data siswa terdaftar di direktori.</p>
                <Link
                  href="/anggota"
                  className="inline-block mt-3 text-xs font-semibold text-[#026AA2] hover:underline"
                >
                  Lihat Direktori Siswa &amp; Alumni &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStudents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs text-center group hover:border-[#0284C7]/40 hover:shadow-md transition-all flex flex-col items-center justify-between"
                  >
                    <div className="w-full flex flex-col items-center">
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
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.is_alumni
                          ? `Alumni (Angkatan ${item.class_year})`
                          : `Siswa Aktif (Angkatan ${item.class_year})`}
                      </p>
                    </div>
                    {item.role && (
                      <span className="inline-block px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                        {item.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
