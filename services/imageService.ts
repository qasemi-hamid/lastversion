
/**
 * Smart Image Compression Service for Giftino
 * Resizes images to max 1080px and compresses quality to 80%
 */

export const compressImage = async (base64Str: string, maxWidth = 1080, maxHeight = 1080, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG (better compatibility than WebP for storage/fetching in some environments)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = (err) => {
      console.error("Image loading error for compression:", err);
      reject(err);
    };
  });
};

/**
 * Utility to handle File objects from inputs directly
 */
export const processFileForUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const compressed = await compressImage(base64);
        resolve(compressed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
  });
};
