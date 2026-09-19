'use client';

import React, { useState, useMemo } from 'react';
import { Member } from '@/lib/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Search, Filter, Users, GraduationCap, Mail } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

interface MembersDirectoryClientProps {
  initialMembers: Member[];
}

export default function MembersDirectoryClient({
  initialMembers,
}: MembersDirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'alumni'>('all');

  // Extract distinct class years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialMembers.map((m) => m.class_year)));
    return years.sort((a, b) => b - a);
  }, [initialMembers]);

  // Client-side reactive filter without full page reload (PRD Acceptance Criteria)
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      // 1. Search term
      const matchesSearch =
        searchTerm.trim() === '' ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Year filter
      const matchesYear =
        selectedYear === 'all' || member.class_year.toString() === selectedYear;

      // 3. Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !member.is_alumni) ||
        (statusFilter === 'alumni' && member.is_alumni);

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [initialMembers, searchTerm, selectedYear, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Pencarian nama/jabatan */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama anggota atau jabatan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Dropdown Filter Angkatan (PRD Modul 3) */}
          <div className="md:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-4 h-4" />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="all">Semua Angkatan</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    Angkatan {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Status Aktif / Alumni */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`py-2 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`py-2 rounded-lg transition-all ${
                  statusFilter === 'active'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('alumni')}
                className={`py-2 rounded-lg transition-all ${
                  statusFilter === 'alumni'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alumni
              </button>
            </div>
          </div>
        </div>

        {/* Info Hasil Filter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredMembers.length}</strong> dari{' '}
            {initialMembers.length} data anggota
          </span>
          {(searchTerm || selectedYear !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedYear('all');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid Kartu Anggota */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Tidak ada anggota yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih tahun angkatan lain untuk menemukan data yang dicari.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col group"
            >
              {/* Foto Profil HD dengan Fallback Placeholder (PRD Kriteria Penerimaan) */}
              <div className="relative bg-slate-100 aspect-square overflow-hidden">
                <OptimizedImage
                  src={member.photo_url}
                  alt={member.name}
                  aspectRatio="1/1"
                  isAvatar={true}
                  className="group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                    Angkatan {member.class_year}
                  </span>
                  {member.is_alumni && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                      <GraduationCap className="w-3 h-3" />
                      Alumni
                    </span>
                  )}
                </div>
              </div>

              {/* Data Anggota */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5 line-clamp-1">
                    {member.role}
                  </p>
                </div>

                {/* Kontak & Sosial Media */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-pink-600 transition-colors"
                      title={member.instagram}
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{member.instagram}</span>
                    </a>
                  )}
                  {member.contact_info && !member.instagram && (
                    <span className="inline-flex items-center gap-1 text-slate-400 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{member.contact_info}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
