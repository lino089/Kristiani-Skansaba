import { google } from 'googleapis';
import { Readable } from 'stream';

const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

export function isGoogleDriveConfigured(): boolean {
  return Boolean(
    serviceAccountEmail &&
    privateKey &&
    !serviceAccountEmail.includes('your-service-account')
  );
}

/**
 * Uploads a file buffer to Google Drive using a Service Account
 */
export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; url: string }> {
  if (!isGoogleDriveConfigured()) {
    // Graceful fallback for local development: encode small images to base64 Data URI
    // or return a mock URL
    const base64 = fileBuffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;
    return {
      fileId: `mock-drive-${Date.now()}`,
      url: dataUri,
    };
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const fileMetadata: { name: string; parents?: string[] } = {
    name: `${Date.now()}-${fileName}`,
  };

  if (folderId) {
    fileMetadata.parents = [folderId];
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = response.data.id || '';

  // Make the file publicly accessible for reading (so wsrv.nl proxy can fetch it)
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (permError) {
    console.warn('Could not set public permission on Google Drive file:', permError);
  }

  // Construct standard direct view URL
  const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return {
    fileId,
    url: driveUrl,
  };
}
