'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public page error caught:', error);
  }, [error]);

  return (
    <div className="py-20 sm:py-32 max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terjadi Kendala Memuat Data
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          Mohon maaf, sistem sedang mengalami kendala saat mengambil data terbaru dari server. Silakan coba muat ulang halaman.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#026AA2] hover:bg-[#025785] text-white shadow-xs transition-all cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Coba Muat Ulang</span>
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
