import React from 'react';
import type { Metadata } from 'next';
import { Image as ImageIcon } from 'lucide-react';
import { getGallery } from '@/lib/data-store';
import GalleryClient from '@/components/public/GalleryClient';

export const metadata: Metadata = {
  title: 'Galeri Multimedia',
  description:
    'Koleksi dokumentasi foto kegiatan ibadah, retret, perayaan paskah, natal, dan kebersamaan siswa Kristiani SMK Negeri 1 Bantul.',
};

export default async function GaleriPage() {
  const gallery = await getGallery();

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Arsip Dokumentasi Visual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Galeri Foto Komunitas
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Kumpulan momen berharga dan kenangan sukacita dalam persekutuan doa, perayaan keagamaan, serta aksi kasih bersama.
        </p>
      </div>

      {/* Gallery Client with Masonry Grid & Lightbox */}
      <GalleryClient initialGallery={gallery} />
    </div>
  );
}
