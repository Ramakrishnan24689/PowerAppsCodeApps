// Utility: safely encode each URL path segment (to handle spaces, `#`, etc.)
const encodePath = (path: string) => path.split('/').map(encodeURIComponent).join('/');

// Utility function to convert image file names or relative paths to SharePoint SiteAssets URLs
export function getSharePointImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // If it's already a full URL (from SharePoint) or data URI, use it directly
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // If a server-relative SharePoint path is provided (e.g., /sites/... or /SiteAssets/...),
  // return as-is. Services should ideally provide absolute URLs.
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise treat as an asset filename bundled with the app
  const cleanPath = imagePath
    .replace(/^\//, '')
    .replace(/^assets\/images\//i, '')
    .replace(/^public\/assets\/images\//i, '')
    .replace(/^\/assets\/images\//i, '');
  return `/assets/images/${encodePath(cleanPath)}`;
}

// Resolve a SharePoint image URL with an optional fallback image file name
export function getImageUrl(sharePointImageUrl?: string, fallbackPath?: string): string {
  if (sharePointImageUrl && sharePointImageUrl.trim()) {
    if (sharePointImageUrl.startsWith('http') || sharePointImageUrl.startsWith('data:')) {
      return sharePointImageUrl;
    }
    return getSharePointImageUrl(sharePointImageUrl);
  }

  if (fallbackPath) {
  return getSharePointImageUrl(fallbackPath);
  }

  // Default fallback image - professional placeholder
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#03787c"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-family="Segoe UI">
        Contoso
      </text>
    </svg>`
  )}`;
}
