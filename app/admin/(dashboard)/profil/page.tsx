'use client';

import React, { useState, useEffect } from 'react';
import { OrganizationProfile, OrganizationStructureItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';
import { Building2, Plus, Trash2, Save, Loader2, CheckCircle2, UserPlus } from 'lucide-react';

export default function AdminProfilPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile editable fields
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [history, setHistory] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState<string[]>([]);
  const [structure, setStructure] = useState<OrganizationStructureItem[]>([]);

  useEffect(() => {
    let ignore = false;
    async function loadProfile() {
      try {
        const res = await fetch('/api/admin/profile');
        const data: OrganizationProfile = await res.json();
        if (!ignore) {
          setName(data.name);
          setSchoolName(data.school_name);
          setHistory(data.history);
          setVision(data.vision);
          setMission(data.mission || []);
          setStructure(data.structure || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadProfile();
    return () => {
      ignore = true;
    };
  }, []);

  // Misi list helpers
  const handleAddMission = () => {
    setMission([...mission, '']);
  };

  const handleUpdateMission = (index: number, val: string) => {
    const updated = [...mission];
    updated[index] = val;
    setMission(updated);
  };

  const handleRemoveMission = (index: number) => {
    setMission(mission.filter((_, i) => i !== index));
  };

  // Struktur list helpers
  const handleAddStructureItem = () => {
    const newItem: OrganizationStructureItem = {
      id: `str-${Date.now()}`,
      name: '',
      role: '',
      level: 'inti',
      photo_url: '',
    };
    setStructure([...structure, newItem]);
  };

  const handleUpdateStructureItem = (
    index: number,
    field: keyof OrganizationStructureItem,
    val: string
  ) => {
    const updated = [...structure];
    updated[index] = { ...updated[index], [field]: val };
    setStructure(updated);
  };

  const handleRemoveStructureItem = (index: number) => {
    setStructure(structure.filter((_, i) => i !== index));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          school_name: schoolName,
          history,
          vision,
          mission: mission.filter((m) => m.trim() !== ''),
          structure,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Memuat data profil &amp; pembina...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 sticky top-0 bg-slate-50/95 backdrop-blur-xs z-20 py-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Profil &amp; Narahubung Kegiatan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ubah sejarah perjalanan, nilai bersama, dan narahubung/pembina tanpa perlu deploy ulang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Perubahan Disimpan!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Identitas Organisasi */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          1. Identitas &amp; Nama Resmi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Persekutuan / Wadah
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Sekolah / Almamater
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Narasi Sejarah */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          2. Narasi Sejarah &amp; Kebersamaan
        </h2>
        <p className="text-xs text-slate-500">
          Tuliskan rekam jejak perjalanan dan kebersamaan persekutuan siswa Kristiani di sekolah.
        </p>
        <textarea
          required
          rows={5}
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
        />
      </div>

      {/* Visi dan Misi */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          3. Nilai &amp; Semangat Bersama
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pesan Nilai &amp; Semangat Bersama
          </label>
          <textarea
            required
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Wujud Nyata Semangat &amp; Pelayanan
            </label>
            <button
              type="button"
              onClick={handleAddMission}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Butir Pelayanan</span>
            </button>
          </div>

          <div className="space-y-2">
            {mission.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-400">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateMission(idx, e.target.value)}
                  placeholder="Tuliskan butir sikap/pelayanan..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMission(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Hapus butir misi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bagan Visual Struktur Kepengurusan */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-base text-slate-900">
              4. Guru Pembina &amp; Koordinator Kegiatan Siswa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar Guru Pembina Agama dan siswa narahubung/PIC pelayanan kegiatan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStructureItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Pembina/Koordinator</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structure.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveStructureItem(idx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                title="Hapus posisi kepengurusan"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => handleUpdateStructureItem(idx, 'name', e.target.value)}
                    placeholder="Nama pengurus..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    required
                    value={item.role}
                    onChange={(e) => handleUpdateStructureItem(idx, 'role', e.target.value)}
                    placeholder="Contoh: Ketua Umum"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Tingkat Bagan
                  </label>
                  <select
                    value={item.level}
                    onChange={(e) => handleUpdateStructureItem(idx, 'level', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="pembina">Guru Pembina</option>
                    <option value="inti">Badan Pengurus Harian (Inti)</option>
                    <option value="divisi">Koordinator Divisi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nama Divisi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={item.division || ''}
                    onChange={(e) => handleUpdateStructureItem(idx, 'division', e.target.value)}
                    placeholder="Contoh: Divisi Musik"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Upload Foto Pengurus */}
              <ImageUploader
                label="Foto Pengurus"
                value={item.photo_url}
                onChange={(url) => handleUpdateStructureItem(idx, 'photo_url', url)}
                aspectRatio="1/1"
                isAvatar={true}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
