import React from 'react';
import type { Metadata } from 'next';
import { getAchievements } from '@/lib/data-store';
import AchievementsClient from '@/components/public/AchievementsClient';

export const metadata: Metadata = {
  title: 'Portofolio Prestasi Siswa',
  description:
    'Etalase capaian kejuaraan, penghargaan, dan prestasi membanggakan siswa-siswi Kristiani SMK Negeri 1 Bantul.',
};

export default async function PrestasiPage() {
  const achievements = await getAchievements();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#026AA2] mb-2">
          Etalase Capaian Juara
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Portofolio Prestasi Siswa
        </h1>
        <p className="text-base text-[#475569] mt-3 leading-relaxed">
          Dokumentasi rasa syukur atas kerja keras, talenta, dan perolehan penghargaan siswa Kristiani Skansaba di tingkat sekolah hingga nasional.
        </p>
      </div>

      {/* Interactive Achievements Client */}
      <AchievementsClient achievements={achievements} />
    </div>
  );
}
