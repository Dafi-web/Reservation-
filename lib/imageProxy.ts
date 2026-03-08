/**
 * For external image URLs (e.g. GitHub), returns a same-origin proxy URL
 * so images load reliably on all devices (including mobile).
 */
export function getProxiedImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
