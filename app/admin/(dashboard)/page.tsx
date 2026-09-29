import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Trophy,
  Calendar,
  Image as ImageIcon,
  Bell,
  ArrowUpRight,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { getDashboardMetrics, getActiveAnnouncement, getEvents } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Ringkasan Dasbor Pengelola',
};

export default async function AdminDashboardPage() {
  const [metrics, activeAnnouncement, events] = await Promise.all([
    getDashboardMetrics(),
    getActiveAnnouncement(),
    getEvents(),
  ]);

  const STAT_CARDS = [
    {
      label: 'Direktori Siswa & Alumni',
      value: metrics.total_members,
      desc: 'Tercatat dalam buku kenangan',
      href: '/admin/anggota',
      icon: Users,
      color: 'bg-[#E0F2FE] text-[#026AA2] border-[#BAE6FD]',
    },
    {
      label: 'Arsip Prestasi',
      value: metrics.total_achievements,
      desc: 'Penghargaan kejuaraan',
      href: '/admin/prestasi',
      icon: Trophy,
      color: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    },
    {
      label: 'Jadwal & Dokumentasi',
      value: metrics.total_events,
      desc: `${metrics.upcoming_events_count} agenda mendatang`,
      href: '/admin/kegiatan',
      icon: Calendar,
      color: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    },
    {
      label: 'Aset Galeri Foto',
      value: metrics.total_gallery,
      desc: 'Dokumentasi terunggah',
      href: '/admin/galeri',
      icon: ImageIcon,
      color: 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Kendali Konten</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Dasbor Pengelola
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola informasi direktori siswa, jadwal ibadah, pengumuman, dan arsip dokumentasi Kristiani Skansaba.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/pengumuman"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Pengumuman</span>
          </Link>
          <Link
            href="/admin/kegiatan"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Agenda Baru</span>
          </Link>
        </div>
      </div>

      {/* Grid Kartu Metrik Ringkasan (PRD Modul 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div className="mt-5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <h3 className="font-bold text-sm text-slate-800 mt-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Baris Status Pengumuman & Agenda Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Banner Pengumuman Status */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base text-slate-900">
                  Status Pengumuman Publik
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeAnnouncement
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activeAnnouncement ? 'Sedang Aktif' : 'Tidak Ada yang Aktif'}
              </span>
            </div>

            {activeAnnouncement ? (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h3 className="font-bold text-sm text-blue-950">
                  {activeAnnouncement.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {activeAnnouncement.content}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-4">
                Saat ini tidak ada pengumuman yang ditampilkan di banner atas halaman publik.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/pengumuman"
              className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs"
            >
              Kelola Pengumuman
            </Link>
          </div>
        </div>

        {/* Sekilas Agenda Terbaru */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base text-slate-900">
                  Agenda Terbaru Terdaftar
                </h2>
              </div>
              <Link
                href="/admin/kegiatan"
                className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs"
              >
                Lihat Semua ({events.length})
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {events.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 text-slate-400 text-xs">
                  Belum ada agenda kegiatan yang terdaftar.
                </div>
              ) : (
                events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
                  >
                    <div className="truncate max-w-[240px] sm:max-w-xs">
                      <p className="font-bold text-slate-800 truncate">{event.title}</p>
                      <p className="text-slate-400 mt-0.5">{event.location}</p>
                    </div>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                        event.status === 'upcoming'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/kegiatan"
              className="text-xs font-semibold text-[#026AA2] hover:text-[#025785] hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs"
            >
              Tambah / Edit Kegiatan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
