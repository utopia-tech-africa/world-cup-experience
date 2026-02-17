import { Express } from 'express';
import { Readable } from 'stream';
import { cloudinary } from '../config/storage.config';

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    // Validate Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Convert buffer to stream for Cloudinary upload
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'world-cup-bookings/payment-proofs',
          resource_type: 'auto', // Automatically detect image or raw (PDF)
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }
          if (!result || !result.secure_url) {
            reject(new Error('Cloudinary upload failed: No URL returned'));
            return;
          }
          resolve(result.secure_url);
        }
      );

      stream.pipe(uploadStream);
    });
  } catch (error: any) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};
