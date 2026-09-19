import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Mail } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" aria-label="Kaki Halaman">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Kolom 1: Profil & Identitas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white/10 p-1 border border-white/10 shadow-md flex-shrink-0">
                <Image
                  src="/LogoKristianiSkansaba.png"
                  alt="Logo Kristiani Skansaba"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Kristiani Skansaba
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Wadah persekutuan, pertumbuhan iman, dan dokumentasi resmi kegiatan siswa-siswi Kristiani SMK Negeri 1 Bantul.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 italic">
              &ldquo;Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong.&rdquo;
              <span className="block mt-1 font-semibold text-blue-400 not-italic">— 1 Korintus 13:4</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Jelajahi Portal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition-colors">
                  Profil & Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/anggota" className="hover:text-white transition-colors">
                  Direktori Anggota & Alumni
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-white transition-colors">
                  Portofolio Prestasi
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-white transition-colors">
                  Agenda & Dokumentasi Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-white transition-colors">
                  Galeri Multimedia
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Lokasi */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Sekretariat & Sekolah
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                <span>
                  SMK Negeri 1 Bantul<br />
                  Jl. Parangtritis Km 11, Sabdodadi, Bantul, D.I. Yogyakarta 55715
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>kristiani@skansaba.sch.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>@kristiani_skansaba</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Komunitas Siswa Kristiani SMK Negeri 1 Bantul. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dikelola dengan penuh</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>untuk kemuliaan Tuhan.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
