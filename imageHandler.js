// Efficient image handling with compression and cloud upload
class ImageHandler {
  constructor() {
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.compressedMaxSize = 1 * 1024 * 1024; // 1MB after compression
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  }

  // Validate image file
  validateImage(file) {
    const errors = [];

    if (!file) {
      errors.push('No file selected');
      return errors;
    }

    if (!this.allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, and WebP images are allowed');
    }

    if (file.size > this.maxFileSize) {
      errors.push(`File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    return errors;
  }

  // Compress image to reduce file size
  compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload image to cloud storage (AWS S3, Cloudinary, etc.)
  async uploadToCloud(file) {
    try {
      // Validate file
      const validationErrors = this.validateImage(file);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Compress image
      const compressedFile = await this.compressImage(file);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', compressedFile, file.name);
      formData.append('folder', 'waste-reports');
      formData.append('timestamp', Date.now().toString());

      // Upload to backend/cloud service
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return {
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        uploadId: result.id
      };

    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Create thumbnail for preview
  createThumbnail(file, size = 150) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const minDim = Math.min(img.width, img.height);
        const x = (img.width - minDim) / 2;
        const y = (img.height - minDim) / 2;

        ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Thumbnail creation failed'));
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Get image metadata
  getImageMetadata(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          fileSize: file.size,
          fileName: file.name,
          fileType: file.type,
          lastModified: file.lastModified
        });
      };

      img.onerror = () => reject(new Error('Failed to load image metadata'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Clean up object URLs to prevent memory leaks
  cleanupObjectURL(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

export default new ImageHandler(); 