import { absoluteUrl } from './routes';

export const buildRobotsTxt = (): string =>
  `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`;
