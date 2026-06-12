/**
 * Utility functions for handling URLs in the frontend application.
 */

/**
 * Gets the backend base URL by removing the trailing '/api' from VITE_API_URL if it exists.
 */
export const getBackendBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Gets the complete URL for an uploaded image file.
 * If the filename is already a full URL, it returns it directly.
 */
export const getUploadImageUrl = (filename?: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const baseUrl = getBackendBaseUrl();
  return `${baseUrl}/uploads/${filename}`;
};
