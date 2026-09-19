import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Siswa Kristiani Skansaba',
    default: 'Komunitas Siswa Kristiani Skansaba - SMK Negeri 1 Bantul',
  },
  description:
    'Website Resmi Komunitas Siswa Kristiani SMK Negeri 1 Bantul (Skansaba). Pusat informasi kegiatan rohani, profil kepengurusan, arsip prestasi, direktori anggota & alumni, serta galeri dokumentasi.',
  keywords: [
    'Kristiani Skansaba',
    'SMK Negeri 1 Bantul',
    'Rohani Kristen Skansaba',
    'Komunitas Siswa Kristen Bantul',
    'Persekutuan Siswa Kristen SMK',
  ],
  authors: [{ name: 'Pengurus Komunitas Siswa Kristiani Skansaba' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Komunitas Siswa Kristiani Skansaba',
    title: 'Komunitas Siswa Kristiani Skansaba - SMK Negeri 1 Bantul',
    description:
      'Pusat informasi kegiatan rohani, profil kepengurusan, arsip prestasi, direktori anggota & alumni, serta galeri dokumentasi.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Komunitas Siswa Kristiani Skansaba',
      },
    ],
  },
  icons: {
    icon: '/LogoKristianiSkansaba.png',
    apple: '/LogoKristianiSkansaba.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
