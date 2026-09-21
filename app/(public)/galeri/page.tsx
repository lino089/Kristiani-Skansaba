import React from 'react';
import type { Metadata } from 'next';
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
        <p className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-2">
          Arsip Dokumentasi Visual
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Galeri Dokumentasi &amp; Kenangan
        </h1>
        <p className="text-base text-[#475569] mt-3 leading-relaxed">
          Kumpulan momen berharga dan kenangan sukacita dalam persekutuan doa, perayaan keagamaan, serta kebersamaan siswa Kristiani.
        </p>
      </div>

      {/* Gallery Client with Masonry Grid & Lightbox */}
      <GalleryClient initialGallery={gallery} />
    </div>
  );
}
