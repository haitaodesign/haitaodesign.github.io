export const SITE_URL = 'https://oldsea.me';
export const SITE_NAME = 'OldSea';
export const AUTHOR_NAME = 'Old Sea (Brett Lee)';
export const OG_IMAGE = `${SITE_URL}/og.jpg`;

export function stripEmoji(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function guidePath(slug?: string[]): string {
  if (!slug?.length) return '/network-guide';
  return `/network-guide/${slug.join('/')}`;
}

export function guideCanonical(slug?: string[]): string {
  return `${SITE_URL}${guidePath(slug)}`;
}
