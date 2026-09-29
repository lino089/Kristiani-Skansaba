'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200 shadow-xs text-center max-w-lg mx-auto my-12 space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">
          Gagal Memuat Halaman Dasbor
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Terjadi kesalahan saat memproses data pada panel kontrol. Pastikan koneksi internet aktif dan database Supabase dapat diakses.
        </p>
      </div>

      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
      >
        <RefreshCcw className="w-4 h-4" />
        <span>Coba Muat Ulang</span>
      </button>
    </div>
  );
}
