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
    default: 'Portal Siswa & Alumni Kristiani Skansaba - SMK Negeri 1 Bantul',
  },
  description:
    'Portal Informasi, Arsip Dokumentasi, dan Direktori Siswa & Alumni Kristiani SMK Negeri 1 Bantul (Skansaba). Ruang persekutuan kekeluargaan oikumene bagi siswa-siswi Kristen dan Katolik.',
  keywords: [
    'Kristiani Skansaba',
    'SMK Negeri 1 Bantul',
    'Persekutuan Siswa Kristiani Skansaba',
    'Direktori Siswa Kristiani',
    'Rohani Kristen Skansaba',
    'Dokumentasi Siswa Kristen Katolik',
  ],
  authors: [{ name: 'Persekutuan Siswa Kristiani Skansaba' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Persekutuan Siswa Kristiani Skansaba',
    title: 'Portal Siswa & Alumni Kristiani Skansaba - SMK Negeri 1 Bantul',
    description:
      'Portal Informasi, Arsip Dokumentasi, dan Direktori Siswa & Alumni Kristiani SMK Negeri 1 Bantul (Skansaba).',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Persekutuan Siswa Kristiani Skansaba',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/LogoKristianiSkansaba.png' },
    ],
    apple: '/LogoKristianiSkansaba.png',
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0D190C',
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
      <body className="min-h-full flex flex-col bg-gradient-to-br from-[#F0F4F1] via-[#FAFBF9] to-[#F1F5F2] bg-fixed text-[#0F172A] font-sans selection:bg-[#0284C7]/20 selection:text-[#026AA2]">
        {children}
      </body>
    </html>
  );
}
