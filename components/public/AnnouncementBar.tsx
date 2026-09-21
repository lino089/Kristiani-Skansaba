'use client';

import React, { useState } from 'react';
import { Announcement } from '@/lib/types';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementBarProps {
  announcement: Announcement | null;
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement || !announcement.is_active || !isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Pengumuman Penting"
      className="bg-[#0D190C]/85 backdrop-blur-md text-amber-200 border-b border-white/10 shadow-xs transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex-shrink-0 p-1.5 rounded-full ring-1 bg-amber-500/20 text-amber-300 ring-amber-400/30">
            <Bell className="w-3.5 h-3.5" />
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
            <span className="font-semibold flex-shrink-0 text-xs uppercase tracking-wide text-amber-400">
              Pengumuman:
            </span>
            <span className="truncate font-medium text-xs sm:text-sm text-white/90">
              {announcement.title}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <Link
            href="/#pengumuman"
            className="hidden md:inline-flex items-center text-xs font-semibold underline underline-offset-2 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden rounded-xs text-sky-300 hover:text-sky-200"
          >
            Baca Selengkapnya
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Tutup Pengumuman"
            className="p-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden cursor-pointer text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
