// Image Validation, Conversion, and File Utilities

export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml'
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No image file was provided.' };
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a PNG, JPG, JPEG, or WEBP image.`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed image size is 10 MB.`
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      // Extract pure base64 without prefix: "data:image/png;base64,...."
      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/png';
      resolve({
        dataUrl,
        base64Data,
        mimeType,
        filename: file.name,
        size: file.size
      });
    };
    reader.onerror = (error) => reject(error);
  });
}

export function urlToBase64(url, filename = 'screenshot.png') {
  return new Promise((resolve, reject) => {
    // If it's already a data URL
    if (url.startsWith('data:')) {
      const parts = url.split(',');
      const mimeType = parts[0].split(';')[0].replace('data:', '');
      const isBase64 = parts[0].includes('base64');
      
      let base64Data = '';
      if (isBase64) {
        base64Data = parts[1];
      } else {
        // Plain URI encoded (like SVG)
        const decoded = decodeURIComponent(parts[1]);
        base64Data = btoa(unescape(encodeURIComponent(decoded)));
      }

      resolve({
        dataUrl: url,
        base64Data,
        mimeType: mimeType || 'image/png',
        filename,
        size: Math.round(base64Data.length * 0.75)
      });
      return;
    }

    // Otherwise fetch the URL
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => fileToBase64(blob))
      .then(resolve)
      .catch(reject);
  });
}
