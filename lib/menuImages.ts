import type { MenuItem } from './types';

/** All image URLs for a menu item (legacy `image` + optional `images[]`). */
export function getMenuItemImageUrls(item: Pick<MenuItem, 'image' | 'images'>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (s: string | undefined) => {
    const t = (s ?? '').trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  if (Array.isArray(item.images)) {
    for (const u of item.images) add(typeof u === 'string' ? u : undefined);
  }
  add(item.image);
  return out;
}

/** Parse admin multiline field (one URL per line; commas also allowed). */
export function parseImageUrlsFromMultiline(text: string): string[] {
  const parts = text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

/** Normalize URLs from API body (`image` + optional `images` array). */
export function parseImageUrlsFromBody(image: unknown, images: unknown): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  if (typeof image === 'string') add(image);
  if (Array.isArray(images)) {
    for (const u of images) {
      if (typeof u === 'string') add(u);
    }
  }
  return out;
}
