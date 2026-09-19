import React from 'react';
import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { getMembers } from '@/lib/data-store';
import MembersDirectoryClient from '@/components/public/MembersDirectoryClient';

export const metadata: Metadata = {
  title: 'Direktori Anggota & Alumni',
  description:
    'Daftar lengkap anggota aktif dan alumni Komunitas Siswa Kristiani SMK Negeri 1 Bantul berdasarkan tahun angkatan.',
};

export default async function AnggotaPage() {
  const members = await getMembers();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Keluarga Besar Skansaba</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Direktori Anggota &amp; Alumni
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Temukan profil rekan seangkatan, kepengurusan aktif, dan jalinan silaturahmi dengan para alumni Kristiani Skansaba.
        </p>
      </div>

      {/* Interactive Directory Client Component */}
      <MembersDirectoryClient initialMembers={members} />
    </div>
  );
}
