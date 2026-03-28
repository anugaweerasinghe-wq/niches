export const SITE_URL =
  (import.meta.env.VITE_SITE_URL ?? 'https://viralhq.vercel.app').replace(/\/$/, '');

export const buildSiteUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};
