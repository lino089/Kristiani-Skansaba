'use client';

import React, { useState, useEffect } from 'react';
import { Achievement, AchievementLevel } from '@/lib/types';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Trophy, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';

export default function AdminPrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [level, setLevel] = useState<AchievementLevel>('Kabupaten');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [certificateUrl, setCertificateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog states (PRD Acceptance Criteria)
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batch selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadAchievements() {
      try {
        const res = await fetch('/api/admin/achievements');
        const data = await res.json();
        if (!ignore) {
          setAchievements(Array.isArray(data) ? data : []);
          setSelectedIds([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadAchievements();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setRecipientName('');
    setLevel('Kabupaten');
    setYear(new Date().getFullYear());
    setCertificateUrl('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Achievement) => {
    setEditingItem(item);
    setTitle(item.title);
    setRecipientName(item.recipient_name);
    setLevel(item.level);
    setYear(item.year);
    setCertificateUrl(item.certificate_url || '');
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem?.id,
          title,
          recipient_name: recipientName,
          level,
          year: Number(year),
          certificate_url: certificateUrl,
          description,
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
      const res = await fetch(`/api/admin/achievements?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteTarget(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = achievements.length > 0 && selectedIds.length === achievements.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(achievements.map((item) => item.id));
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
      const res = await fetch('/api/admin/achievements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        setIsBulkConfirmOpen(false);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
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
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Manajemen Prestasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Arsipkan sertifikat penghargaan, piala, dan kejuaraan yang diraih siswa Kristiani.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi</span>
        </button>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/80 px-4 py-3 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {selectedIds.length} prestasi dipilih
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-blue-700 hover:text-blue-900 underline font-medium ml-2 cursor-pointer"
            >
              Batalkan Pilihan
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsBulkConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-xs cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus {selectedIds.length} Prestasi Terpilih</span>
          </button>
        </div>
      )}

      {/* Tabel Data Prestasi */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Memuat arsip prestasi...</p>
        </div>
      ) : achievements.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800">Belum ada prestasi terdaftar</p>
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
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      title="Pilih Semua"
                    />
                  </th>
                  <th className="px-6 py-4">Dokumentasi Piagam</th>
                  <th className="px-6 py-4">Nama Kejuaraan &amp; Penerima</th>
                  <th className="px-6 py-4">Tingkat &amp; Tahun</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {achievements.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="w-12 px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <OptimizedImage
                            src={item.certificate_url}
                            alt={item.title}
                            aspectRatio="16/9"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">
                          Penerima: {item.recipient_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {item.level}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          Tahun {item.year}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Prestasi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Prestasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Prestasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}
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
                  Nama Kejuaraan / Penghargaan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Juara 1 Vokal Solo Rohani Remaja"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Siswa Penerima / Tim
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Contoh: Keisha Abigail"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tingkat Kejuaraan
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as AchievementLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Perolehan
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Upload Bukti Piagam / Sertifikat */}
              <ImageUploader
                label="Foto Piagam / Sertifikat / Piala"
                value={certificateUrl}
                onChange={(url) => setCertificateUrl(url)}
                aspectRatio="16/9"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Keterangan Tambahan
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan mengenai penyelenggara, kategori lomba, atau karya..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
                />
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Prestasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Data (PRD Acceptance Criteria) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Prestasi?"
        message={`Apakah Anda yakin ingin menghapus data prestasi "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Dialog Konfirmasi Hapus Masal */}
      <ConfirmDialog
        isOpen={isBulkConfirmOpen}
        title="Hapus Data Terpilih?"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} data prestasi yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel={`Ya, Hapus ${selectedIds.length} Prestasi`}
        isLoading={isBulkDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsBulkConfirmOpen(false)}
      />
    </div>
  );
}
