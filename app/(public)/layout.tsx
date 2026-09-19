import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import AnnouncementBar from '@/components/public/AnnouncementBar';
import { getActiveAnnouncement } from '@/lib/data-store';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeAnnouncement = await getActiveAnnouncement();

  return (
    <div className="min-h-screen flex flex-col flex-1">
      <AnnouncementBar announcement={activeAnnouncement} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
