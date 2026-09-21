'use client';

import React, { useState } from 'react';
import { Achievement } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Trophy, Eye, X, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AchievementsClientProps {
  achievements: Achievement[];
}

export default function AchievementsClient({ achievements }: AchievementsClientProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>('all');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedAchievement) {
        setSelectedAchievement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAchievement]);

  // Filter achievements
  const filtered = achievements
    .filter((a) => {
      if (levelFilter === 'all') return true;
      return a.level.toLowerCase() === levelFilter.toLowerCase();
    })
    // Sorted descending by year (Acceptance Criteria)
    .sort((a, b) => b.year - a.year);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'nasional':
      case 'internasional':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'provinsi':
        return 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]';
      case 'kabupaten':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]';
      default:
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
    }
  };

  return (
    <div className="space-y-8">
      {/* Level Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['all', 'Nasional', 'Provinsi', 'Kabupaten', 'Sekolah'].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setLevelFilter(lvl)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer ${
              levelFilter.toLowerCase() === lvl.toLowerCase()
                ? 'bg-[#026AA2] text-white shadow-xs'
                : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
            }`}
          >
            {lvl === 'all' ? 'Semua Tingkat' : `Tingkat ${lvl}`}
          </button>
        ))}
      </div>

      {/* Grid Kartu Prestasi */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] shadow-xs">
          <Trophy className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <p className="font-semibold text-[#0F172A]">Belum ada data prestasi untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((ach) => (
            <article
              key={ach.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col justify-between group"
            >
              {/* Gambar / Bukti Sertifikat */}
              <div
                className="relative cursor-pointer overflow-hidden bg-[#F1F5F9]"
                onClick={() => setSelectedAchievement(ach)}
              >
                <OptimizedImage
                  src={ach.certificate_url}
                  alt={ach.title}
                  aspectRatio="16/9"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A]/80 backdrop-blur-xs text-xs font-semibold shadow-xs">
                    <Eye className="w-4 h-4" />
                    Lihat Piagam
                  </span>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${getLevelColor(
                      ach.level
                    )}`}
                  >
                    <Trophy className="w-3 h-3" />
                    Tingkat {ach.level}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0F172A]/85 text-white backdrop-blur-xs shadow-xs">
                    {ach.year}
                  </span>
                </div>
              </div>

              {/* Detail Prestasi */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#0F172A] group-hover:text-[#026AA2] transition-colors">
                    {ach.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#64748B] block">Penerima / Perwakilan:</span>
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {ach.recipient_name}
                      </span>
                    </div>
                  </div>

                  {ach.description && (
                    <p className="text-xs text-[#475569] mt-3 line-clamp-3 leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>

                {/* Footer kartu dengan aksi modal & link direktori */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedAchievement(ach)}
                    className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Piagam</span>
                  </button>

                  <Link
                    href="/anggota"
                    className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs"
                  >
                    <span>Profil Anggota</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL / LIGHTBOX PRATINJAU BUKTI PIAGAM (PRD Modul 4) */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E2E8F0] relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8F9FA]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getLevelColor(
                    selectedAchievement.level
                  )}`}
                >
                  Tingkat {selectedAchievement.level}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">
                  Tahun {selectedAchievement.year}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                aria-label="Tutup Pratinjau (Escape)"
                className="p-1.5 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Gambar Modal */}
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9]">
                <OptimizedImage
                  src={selectedAchievement.certificate_url}
                  alt={selectedAchievement.title}
                  aspectRatio="16/9"
                  className="w-full h-auto object-contain max-h-[50vh]"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-[#0F172A]">
                  {selectedAchievement.title}
                </h3>
                <p className="text-sm font-semibold text-[#026AA2] mt-1">
                  Penerima: {selectedAchievement.recipient_name}
                </p>
                {selectedAchievement.description && (
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-[#F1F5F9] bg-[#F8F9FA] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-[#334155] bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
