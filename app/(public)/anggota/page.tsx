import React from 'react';
import type { Metadata } from 'next';
import { getMembers } from '@/lib/data-store';
import MembersDirectoryClient from '@/components/public/MembersDirectoryClient';

export const metadata: Metadata = {
  title: 'Siswa',
  description:
    'Buku kenangan dan direktori lengkap siswa-siswi aktif serta alumni Kristiani SMK Negeri 1 Bantul per angkatan.',
};

export default async function AnggotaPage() {
  const members = await getMembers();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-2">
          Keluarga Besar Skansaba
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Siswa
        </h1>
        <p className="text-base text-[#475569] mt-3 leading-relaxed">
          Buku kenangan dan arsip siswa per angkatan untuk mempererat tali persaudaraan antara siswa aktif dan para alumni Kristiani Skansaba.
        </p>
      </div>

      {/* Interactive Directory Client Component */}
      <MembersDirectoryClient initialMembers={members} />
    </div>
  );
}
