'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Info,
  Users,
  Trophy,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/profil', label: 'Profil', icon: Info },
  { href: '/anggota', label: 'Siswa', icon: Users },
  { href: '/prestasi', label: 'Prestasi', icon: Trophy },
  { href: '/kegiatan', label: 'Kegiatan', icon: Calendar },
  { href: '/galeri', label: 'Galeri', icon: ImageIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0D190C]/90 backdrop-blur-md border-b border-white/10 text-white transition-all shadow-xs">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigasi Utama">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-xs border border-white/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Image
                src="/LogoKristianiSkansaba.png"
                alt="Logo Kristiani Skansaba"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-white leading-tight tracking-tight flex items-center gap-1.5">
                <span>Kristiani Skansaba</span>
              </div>
              <p className="text-xs text-white/70 font-medium hidden sm:block">
                SMK Negeri 1 Bantul
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden ${
                    active
                      ? 'bg-white/15 text-white border border-white/20 font-semibold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-white/15 bg-[#0D190C]/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1 shadow-md">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden ${
                  active
                    ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-white/70'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
