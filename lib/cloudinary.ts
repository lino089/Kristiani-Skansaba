import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; url: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Kredensial Cloudinary belum dikonfigurasi di .env.local');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'kristiani_skansaba',
        resource_type: 'auto',
        // Biarkan nama asli, hapus ekstensi untuk public_id
        public_id: `${Date.now()}_${fileName.replace(/\.[^/.]+$/, "")}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Gagal mengunggah ke Cloudinary'));
        } else {
          resolve({
            fileId: result.public_id,
            url: result.secure_url,
          });
        }
      }
    );

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
}
