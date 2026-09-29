import React from 'react';
import Link from 'next/link';
import { Compass, Home, Calendar } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#026AA2] flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#026AA2] bg-[#E0F2FE] px-3 py-1 rounded-full border border-[#BAE6FD]">
            Halaman Tidak Ditemukan • 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight pt-2">
            Halaman Belum Tersedia
          </h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Halaman atau arsip kegiatan yang Anda tuju tidak ditemukan atau mungkin tautan telah diperbarui.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#026AA2] hover:bg-[#025785] text-white shadow-xs transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Link>
          <Link
            href="/kegiatan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] shadow-xs transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Lihat Agenda Kegiatan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
