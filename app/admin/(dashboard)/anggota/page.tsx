'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Member } from '@/lib/types';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import OptimizedImage from '@/components/ui/OptimizedImage';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  GraduationCap,
  Loader2,
  X,
  Mail,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function AdminAnggotaPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Member | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [classYear, setClassYear] = useState<number>(new Date().getFullYear());
  const [isAlumni, setIsAlumni] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog states (PRD Acceptance Criteria)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadMembers() {
      try {
        const res = await fetch('/api/admin/members');
        const data = await res.json();
        if (!ignore) {
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadMembers();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(members.map((m) => m.class_year)));
    return years.sort((a, b) => b - a);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchYear =
        selectedYear === 'all' || m.class_year.toString() === selectedYear;
      return matchSearch && matchYear;
    });
  }, [members, searchTerm, selectedYear]);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setRole('Anggota');
    setClassYear(new Date().getFullYear());
    setIsAlumni(false);
    setPhotoUrl('');
    setContactInfo('');
    setInstagram('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Member) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setClassYear(item.class_year);
    setIsAlumni(item.is_alumni);
    setPhotoUrl(item.photo_url || '');
    setContactInfo(item.contact_info || '');
    setInstagram(item.instagram || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem?.id,
          name,
          role,
          class_year: Number(classYear),
          is_alumni: isAlumni,
          photo_url: photoUrl,
          contact_info: contactInfo,
          instagram,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/members?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected =
    filteredMembers.length > 0 &&
    filteredMembers.every((m) => selectedIds.includes(m.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIdSet = new Set(filteredMembers.map((m) => m.id));
      setSelectedIds(selectedIds.filter((id) => !filteredIdSet.has(id)));
    } else {
      const combined = new Set([...selectedIds, ...filteredMembers.map((m) => m.id)]);
      setSelectedIds(Array.from(combined));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        setIsBulkConfirmOpen(false);
        setRefreshKey((k) => k + 1);
      } else {
        alert(data.message || 'Gagal menghapus data.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus data.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Direktori Siswa &amp; Alumni (Buku Kenangan)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Arsip data siswa aktif, foto kenangan, dan catatan alumni per angkatan.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa / Alumni</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau pelayanan..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="sm:w-56 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden appearance-none cursor-pointer"
          >
            <option value="all">Semua Angkatan</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr.toString()}>
                Angkatan {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
              {selectedIds.length}
            </span>
            <span>siswa &amp; alumni terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal Pilihan
            </button>
            <button
              type="button"
              onClick={() => setIsBulkConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus {selectedIds.length} Data Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabel Data Anggota */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Memuat direktori anggota...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800">Tidak ada anggota yang ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="w-12 px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      aria-label="Pilih semua data siswa"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Profil &amp; Nama</th>
                  <th className="px-6 py-4">Angkatan &amp; Status</th>
                  <th className="px-6 py-4">Kontak / Sosmed</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      selectedIds.includes(item.id) ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="w-12 px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                        aria-label={`Pilih ${item.name}`}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          <OptimizedImage
                            src={item.photo_url}
                            alt={item.name}
                            aspectRatio="1/1"
                            isAvatar={true}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs text-blue-600 font-medium">{item.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-700">
                          {item.class_year}
                        </span>
                        {item.is_alumni && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            <GraduationCap className="w-3 h-3" />
                            Alumni
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 space-y-1">
                      {item.instagram && (
                        <p className="flex items-center gap-1">
                          <InstagramIcon className="w-3 h-3 text-pink-600" />
                          <span>{item.instagram}</span>
                        </p>
                      )}
                      {item.contact_info && (
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{item.contact_info}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Anggota"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Anggota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Data Siswa / Alumni' : 'Tambah Siswa / Alumni Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Jonathan Immanuel"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Keterangan / Minat Pelayanan
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Contoh: Siswa / Musik &amp; Pujian / Liturgi"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Angkatan
                  </label>
                  <input
                    type="number"
                    required
                    value={classYear}
                    onChange={(e) => setClassYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAlumniToggle"
                  checked={isAlumni}
                  onChange={(e) => setIsAlumni(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm cursor-pointer"
                />
                <label htmlFor="isAlumniToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Tandai Sebagai Alumni (Sudah Lulus)
                </label>
              </div>

              {/* Upload Foto Anggota HD */}
              <ImageUploader
                label="Foto Profil / Kenangan HD"
                value={photoUrl}
                onChange={(url) => setPhotoUrl(url)}
                aspectRatio="1/1"
                isAvatar={true}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@nama_akun"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kontak / Email (Opsional)
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="email@skansaba.sch.id"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Data Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Data (PRD Acceptance Criteria) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Siswa / Alumni?"
        message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.name}" dari direktori?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Dialog Konfirmasi Hapus Masal */}
      <ConfirmDialog
        isOpen={isBulkConfirmOpen}
        title="Hapus Data Terpilih?"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} data siswa/alumni yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel={`Ya, Hapus ${selectedIds.length} Data`}
        isLoading={isBulkDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsBulkConfirmOpen(false)}
      />
    </div>
  );
}
