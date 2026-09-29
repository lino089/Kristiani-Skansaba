'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prank honeypot states
  const [showPrankModal, setShowPrankModal] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showPrankModal && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay with sound might need user interaction or controls
      });
    } else if (!showPrankModal && videoRef.current) {
      videoRef.current.pause();
    }
  }, [showPrankModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPrankModal) {
        setShowPrankModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPrankModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Trap specific honeypot credentials directly on client
    if (
      email.trim().toLowerCase() === 'admin@skansaba.sch.id' &&
      password === 'skansaba2026kristen'
    ) {
      setShowPrankModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.isPrank) {
        setShowPrankModal(true);
        return;
      }

      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMsg(data.message || 'Email atau kata sandi tidak valid.');
      }
    } catch {
      setErrorMsg('Terjadi gangguan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white p-1.5 border border-[#E2E8F0] mx-auto shadow-xs">
          <Image
            src="/LogoKristianiSkansaba.png"
            alt="Logo Kristiani Skansaba"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Panel Masuk CMS
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Persekutuan Siswa Kristiani SMK Negeri 1 Bantul
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
            Email Pembina / Pengelola
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@skansaba.sch.id"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#026AA2] hover:bg-[#025785] disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Sesi...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk ke Dasbor</span>
            </>
          )}
        </button>
      </form>

      {/* Info Default Credentials untuk Development */}
      <div className="pt-4 border-t border-[#F1F5F9] text-center text-xs text-[#64748B] space-y-1">
        <p className="font-semibold text-[#475569]">Akses Pengurus Default:</p>
        <p className="font-mono text-[#64748B]">admin@skansaba.sch.id / skansaba2026kristen</p>
      </div>

      {/* Prank Meme Video Modal (Honeypot Trap) */}
      {showPrankModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowPrankModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🤣</span>
                <h3 className="font-bold text-sm sm:text-base text-amber-400 tracking-tight">
                  Reaksi Gue....🤣
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrankModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Area */}
            <div className="relative bg-black flex items-center justify-center min-h-[260px] max-h-[65vh] overflow-hidden">
              <video
                ref={videoRef}
                src="/prank.mp4"
                autoPlay
                controls
                playsInline
                loop
                className="w-full h-full max-h-[60vh] object-contain"
                onError={() => setVideoError(true)}
              />

              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/95 space-y-3">
                  <span className="text-4xl">🎬</span>
                  <p className="font-bold text-amber-400 text-sm">
                    Video Prank Belum Ditemukan!
                  </p>
                  <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                    Silakan letakkan file video meme Anda ke dalam folder:
                  </p>
                  <code className="text-amber-300 text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg select-all">
                    public/prank.mp4
                  </code>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    (Pastikan nama filenya tepat: <strong>prank.mp4</strong> di dalam folder <strong>public</strong>)
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 text-center space-y-3 bg-slate-950/70 border-t border-slate-800">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Maaf developernya ga sepolos itu 🤣🙏
              </p>
              <button
                type="button"
                onClick={() => setShowPrankModal(false)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
              >
                Tutup &amp; Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4F1] via-[#FAFBF9] to-[#F1F5F2] bg-fixed flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Link Kembali */}
        <div className="mb-6 text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#026AA2] transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden rounded-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Publik</span>
          </Link>
        </div>

        {/* Suspense Wrapper to prevent CSR bailout on useSearchParams */}
        <Suspense
          fallback={
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center text-[#0F172A] shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#026AA2]" />
              <p className="text-xs text-[#64748B] mt-2">Memuat halaman login...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
