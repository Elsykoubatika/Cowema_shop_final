
/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url YouTube URL
 * @returns YouTube video ID
 */
export const getYouTubeVideoId = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    let videoId = '';
    const trimmedUrl = url.trim();
    
    // Handle different YouTube URL formats
    if (trimmedUrl.includes('youtube.com/embed/')) {
      const embedMatch = trimmedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      videoId = embedMatch ? embedMatch[1].split('?')[0] : '';
    } else if (trimmedUrl.includes('youtube.com/watch')) {
      // Handle youtube.com/watch?v=VIDEO_ID format
      const urlObj = new URL(trimmedUrl);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (trimmedUrl.includes('youtu.be/')) {
      // Handle youtu.be/VIDEO_ID format
      const shortMatch = trimmedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      videoId = shortMatch ? shortMatch[1].split('?')[0] : '';
    } else if (trimmedUrl.includes('youtube.com/v/')) {
      // Handle youtube.com/v/VIDEO_ID format
      const vMatch = trimmedUrl.match(/youtube\.com\/v\/([a-zA-Z0-9_-]+)/);
      videoId = vMatch ? vMatch[1].split('?')[0] : '';
    }
    
    // Validate the video ID (YouTube video IDs are typically 11 characters)
    // IMPORTANT: Never return 'watch' as it's not a valid video ID
    if (videoId && videoId !== 'watch' && videoId.length >= 10 && videoId.length <= 12 && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
      return videoId;
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting YouTube video ID:', error);
    return '';
  }
};

/**
 * Get YouTube thumbnail URL from YouTube video URL
 * @param url YouTube URL
 * @returns YouTube thumbnail URL
 */
export const getYouTubeThumbnailUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId && videoId !== 'watch') {
    // Try to get higher quality thumbnail first (hqdefault)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
};

/**
 * Get YouTube fallback thumbnail URL (lower quality) if the high quality one fails
 * @param url YouTube URL
 * @returns YouTube fallback thumbnail URL
 */
export const getYouTubeFallbackThumbnailUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId && videoId !== 'watch') {
    // Fallback to medium quality thumbnail (mqdefault)
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return '';
};

/**
 * Format YouTube URL to embed format
 * @param url YouTube URL
 * @returns YouTube embed URL
 */
export const formatYouTubeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const videoId = getYouTubeVideoId(url);
    if (videoId && videoId !== 'watch') {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If we couldn't extract video ID, return empty string instead of malformed URL
    return '';
  } catch (error) {
    console.error('Error formatting YouTube URL:', error);
    return '';
  }
};

/**
 * Check if URL is a YouTube URL
 * @param url URL to check
 * @returns true if URL is a YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const trimmedUrl = url.trim();
    return trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be');
  } catch (error) {
    return false;
  }
};

/**
 * Check if an image URL is valid by trying to load it
 * @param url Image URL to check
 * @returns Promise that resolves to boolean (true if valid, false if invalid)
 */
export const isImageValid = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Set a timeout to prevent hanging
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * Validate and clean YouTube video URL
 * @param url YouTube URL to validate
 * @returns Clean YouTube URL or empty string if invalid
 */
export const validateYouTubeUrl = (url: string): string => {
  if (!isYouTubeUrl(url)) return '';
  
  const videoId = getYouTubeVideoId(url);
  if (!videoId || videoId === 'watch') return '';
  
  return `https://www.youtube.com/watch?v=${videoId}`;
};
