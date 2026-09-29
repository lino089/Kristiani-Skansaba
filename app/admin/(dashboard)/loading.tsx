import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="py-24 text-center space-y-4">
      <Loader2 className="w-9 h-9 animate-spin text-blue-600 mx-auto" />
      <p className="text-sm font-medium text-slate-600">Memuat data dasbor pengelola...</p>
    </div>
  );
}
