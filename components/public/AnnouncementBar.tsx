'use client';

import React, { useState } from 'react';
import { Announcement } from '@/lib/types';
import { Bell, X, ArrowRight } from 'lucide-react';
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
    <aside aria-label="Pengumuman Penting" className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex-shrink-0 bg-blue-500/40 p-1.5 rounded-full ring-1 ring-white/20">
            <Bell className="w-4 h-4 text-blue-100 animate-pulse" />
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
            <span className="font-semibold text-blue-100 flex-shrink-0">
              Pengumuman:
            </span>
            <span className="text-white/90 truncate">
              {announcement.title}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <Link
            href="/#pengumuman"
            className="hidden md:inline-flex items-center text-xs font-medium text-blue-200 hover:text-white underline underline-offset-2 transition-colors"
          >
            Baca Selengkapnya
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Tutup Pengumuman"
            className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
