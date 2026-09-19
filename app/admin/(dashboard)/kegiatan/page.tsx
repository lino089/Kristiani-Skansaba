'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, EventStatus } from '@/lib/types';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Calendar, Plus, Edit2, Trash2, Loader2, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminKegiatanPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog states (PRD Acceptance Criteria)
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadEvents() {
      try {
        const res = await fetch('/api/admin/events');
        const data = await res.json();
        if (!ignore) {
          setEvents(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadEvents();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setTime('08.00 - Selesai');
    setLocation('SMK Negeri 1 Bantul');
    setStatus('upcoming');
    setSummary('');
    setDescription('');
    setCoverImageUrl('');
    setGalleryUrls([]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EventItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setEventDate(item.event_date);
    setTime(item.time || '');
    setLocation(item.location);
    setStatus(item.status);
    setSummary(item.summary || '');
    setDescription(item.description);
    setCoverImageUrl(item.cover_image_url || '');
    setGalleryUrls(item.gallery_urls || []);
    setIsModalOpen(true);
  };

  // Auto generate slug from title when creating
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleAddGalleryPhoto = () => {
    if (newGalleryUrl.trim()) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem?.id,
          title,
          slug,
          event_date: eventDate,
          time,
          location,
          status,
          summary,
          description,
          cover_image_url: coverImageUrl,
          gallery_urls: galleryUrls,
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
      const res = await fetch(`/api/admin/events?id=${deleteTarget.id}`, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Manajemen Kegiatan &amp; Acara</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur agenda kegiatan mendatang, dokumentasi kegiatan selesai, serta foto pelaksanaannya.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      {/* Tabel Kegiatan */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Memuat agenda kegiatan...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800">Belum ada agenda terdaftar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cover &amp; Judul Acara</th>
                  <th className="px-6 py-4">Waktu &amp; Lokasi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          <OptimizedImage
                            src={item.cover_image_url}
                            alt={item.title}
                            aspectRatio="16/9"
                          />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-400 font-mono">/kegiatan/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">
                        {new Date(item.event_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-400 mt-0.5 line-clamp-1">{item.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'upcoming'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/kegiatan/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors inline-block"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Kegiatan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Kegiatan"
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

      {/* Modal Tambah / Edit Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Data Kegiatan' : 'Tambah Kegiatan Baru'}
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
                  Nama / Judul Kegiatan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Retret Rohani & Karakter 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Slug URL (SEO Ramah)
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="retret-rohani-2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Kegiatan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EventStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="upcoming">Kegiatan Mendatang (Upcoming)</option>
                    <option value="completed">Kegiatan Selesai (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Waktu / Jam Acara
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08.00 - 15.00 WIB"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lokasi / Tempat
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Aula Skansaba / Wisma Kaliurang"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ringkasan Singkat (Untuk Tampilan Kartu Beranda)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat tentang acara..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Lengkap Kegiatan
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Susunan acara, tema firman, peserta, dan tujuan kegiatan..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Cover Image Upload */}
              <ImageUploader
                label="Cover Banner Kegiatan"
                value={coverImageUrl}
                onChange={(url) => setCoverImageUrl(url)}
                aspectRatio="16/9"
              />

              {/* Dokumentasi Terkait Galeri */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Foto-foto Dokumentasi Terkait Acara
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Masukkan URL foto dokumentasi..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Tambah Foto
                  </button>
                </div>

                {galleryUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square group">
                        <OptimizedImage src={url} alt={`Dokumentasi ${idx}`} aspectRatio="1/1" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Data (PRD Acceptance Criteria) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Kegiatan?"
        message={`Apakah Anda yakin ingin menghapus kegiatan "${deleteTarget?.title}"? Seluruh galeri terkait juga akan terhapus.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
