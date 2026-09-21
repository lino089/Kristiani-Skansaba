import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventBySlug, getEvents } from '@/lib/data-store';
import EventDetailClient from '@/components/public/EventDetailClient';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Static Params for build time SSG
export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

// OpenGraph & Dynamic Metadata per PRD Acceptance Criteria (Modul 5)
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Kegiatan Tidak Ditemukan',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/kegiatan/${event.slug}`;
  const ogImageUrl =
    event.cover_image_url ||
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=630&fit=crop';

  return {
    title: event.title,
    description: event.summary || event.description.slice(0, 160),
    openGraph: {
      title: `${event.title} | Kristiani Skansaba`,
      description: event.summary || event.description.slice(0, 160),
      url: pageUrl,
      siteName: 'Persekutuan Siswa Kristiani Skansaba',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.summary || event.description.slice(0, 160),
      images: [ogImageUrl],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <EventDetailClient event={event} />
    </div>
  );
}
