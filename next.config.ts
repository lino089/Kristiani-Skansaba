import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'wsrv.nl' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'kzthmrtcjaykedawvzhq.supabase.co' }
    ],
  },
};

export default nextConfig;
