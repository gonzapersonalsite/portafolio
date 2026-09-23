import { absoluteUrl, ROUTES } from './routes';

export const buildSitemap = (): string => {
  const urls = ROUTES.map(
    (route) => `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n  </url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
