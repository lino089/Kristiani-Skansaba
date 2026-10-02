'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bell,
  Building2,
  Users,
  Trophy,
  Calendar,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const ADMIN_MENUS = [
  { href: '/admin', label: 'Ringkasan Dasbor', icon: LayoutDashboard },
  { href: '/admin/pengumuman', label: 'Pengumuman', icon: Bell },
  { href: '/admin/profil', label: 'Profil & Pembina', icon: Building2 },
  { href: '/admin/anggota', label: 'Siswa', icon: Users },
  { href: '/admin/prestasi', label: 'Prestasi', icon: Trophy },
  { href: '/admin/kegiatan', label: 'Jadwal & Dokumentasi', icon: Calendar },
  { href: '/admin/galeri', label: 'Galeri Foto', icon: ImageIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 p-0.5 border border-white/10 flex-shrink-0">
            <Image
              src="/LogoKristianiSkansaba.png"
              alt="Logo Kristiani Skansaba"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-sm">CMS Kristiani</h1>
            <p className="text-[10px] text-slate-400">SMKN 1 Bantul</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white/10 p-1 border border-white/10 shadow-xs flex-shrink-0">
                <Image
                  src="/LogoKristianiSkansaba.png"
                  alt="Logo Kristiani Skansaba"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-bold text-base text-white tracking-tight">
                  Admin CMS
                </h2>
                <p className="text-xs text-slate-400">Kristiani Skansaba</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {ADMIN_MENUS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden ${
                    active
                      ? 'bg-[#026AA2] text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Buka Website Publik</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-950/50 border border-red-900/30 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-hidden cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar (Logout)'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
