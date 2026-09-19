import React from 'react';
import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import { getAchievements } from '@/lib/data-store';
import AchievementsClient from '@/components/public/AchievementsClient';

export const metadata: Metadata = {
  title: 'Portofolio Prestasi Anggota',
  description:
    'Etalase capaian kejuaraan, penghargaan, dan prestasi membanggakan siswa-siswi Kristiani SMK Negeri 1 Bantul.',
};

export default async function PrestasiPage() {
  const achievements = await getAchievements();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
          <Trophy className="w-3.5 h-3.5" />
          <span>Etalase Capaian Juara</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Portofolio Prestasi Anggota
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Dokumentasi rasa syukur atas kerja keras, talenta, dan perolehan penghargaan siswa Kristiani Skansaba di tingkat sekolah hingga nasional.
        </p>
      </div>

      {/* Interactive Achievements Client */}
      <AchievementsClient achievements={achievements} />
    </div>
  );
}
