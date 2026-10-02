/**
 * Image proxy and optimization utilities using wsrv.nl
 * In compliance with PRD Section 5.1 & 6:
 * - Google Drive / remote images transformed to WebP (~85% quality)
 * - Cached via wsrv.nl CDN proxy
 * - Graceful fallback to default placeholders
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
}

/**
 * Standard SVG placeholders encoded as data URI to prevent broken image icons
 */
export const DEFAULT_AVATAR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e2e8f0'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ccircle cx='100' cy='75' r='40' fill='%2394a3b8'/%3E%3Cpath d='M30 180 c0 -40 30 -60 70 -60 c40 0 70 20 70 60 Z' fill='%2394a3b8'/%3E%3C/svg%3E";

export const DEFAULT_EVENT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23f8fafc'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Cpath d='M250 170 L350 170 L300 240 Z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='80%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b'%3EDokumentasi Kegiatan%3C/text%3E%3C/svg%3E";

/**
 * Extracts Google Drive ID if present in the URL
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/id=([a-zA-Z0-9_-]+)/) ||
    url.match(/([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

/**
 * Converts a raw image URL (Google Drive, Unsplash, external, etc.) to an optimized wsrv.nl proxy URL.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: ImageTransformOptions = {},
  isAvatar: boolean = false
): string {
  if (!url || url.trim() === '') {
    return isAvatar ? DEFAULT_AVATAR_PLACEHOLDER : DEFAULT_EVENT_PLACEHOLDER;
  }

  // Already a data URI or local static asset
  if (url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }

  const { width, height, quality = 85, fit = 'cover' } = options;

  let targetUrl = url;

  // Handle Cloudinary links natively
  if (url.includes('res.cloudinary.com')) {
    // Sisipkan transformasi f_auto,q_auto,w_{width},c_{fit}
    const transforms = ['f_auto', 'q_auto'];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (fit === 'cover') transforms.push('c_fill');
    else if (fit === 'contain') transforms.push('c_fit');
    
    const transformStr = transforms.join(',');
    // Pisahkan URL pada bagian /upload/
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformStr}/${parts[1]}`;
    }
    return url;
  }

  // Handle Google Drive links
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    const driveId = extractGoogleDriveId(url);
    if (driveId) {
      // wsrv.nl can directly load Google Drive images through thumbnail/uc endpoint
      targetUrl = `https://drive.google.com/uc?export=view&id=${driveId}`;
    }
  }

  const params = new URLSearchParams();
  params.set('url', targetUrl);
  params.set('output', 'webp');
  params.set('q', quality.toString());
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (fit) params.set('fit', fit);

  return `https://wsrv.nl/?${params.toString()}`;
}
