import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Upload Function (Buffer support added)
export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = "vistara-uploads"): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) {
          resolve({ 
            secure_url: result.secure_url, 
            public_id: result.public_id 
          });
        }
      }
    );
    // Buffer theke stream e convert kore upload kora hoy
    uploadStream.end(fileBuffer);
  });
};

// 2. Delete Function
export const deleteFromCloudinary = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

// Helper: URL theke Public ID ber kora (Delete er jonno lage)
export const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1]; // image.jpg
  const fileName = lastPart.split('.')[0]; // image
  // Folder name shoho nite hobe (e.g., vistara-uploads/image)
  const folder = parts[parts.length - 2]; 
  return `${folder}/${fileName}`;
};

export default cloudinary;