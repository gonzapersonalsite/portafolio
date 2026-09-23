import { buildLlmsTxt } from './llmsTxt';
import { buildRobotsTxt } from './robotsTxt';
import { buildSitemap } from './sitemap';
import { buildTwin } from './twins';
import { ROUTES, twinPathOf, type Locale } from './routes';

export interface AgentFile {
  path: string;
  source: string;
  contentType: string;
}

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';
const LOCALES: readonly Locale[] = ['en', 'es'];

export const buildAgentFiles = (): AgentFile[] => [
  { path: '/llms.txt', source: buildLlmsTxt(), contentType: 'text/plain; charset=utf-8' },
  { path: '/robots.txt', source: buildRobotsTxt(), contentType: 'text/plain; charset=utf-8' },
  { path: '/sitemap.xml', source: buildSitemap(), contentType: 'application/xml; charset=utf-8' },
  ...ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      path: twinPathOf(route, locale),
      source: buildTwin(route.id, locale),
      contentType: MARKDOWN_CONTENT_TYPE,
    })),
  ),
];
