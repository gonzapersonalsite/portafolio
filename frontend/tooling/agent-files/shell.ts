import { absoluteUrl, twinPathOf, type RouteSpec } from './routes';

const BLOCK_PATTERN = /<!-- agent-files:start -->[\s\S]*?<!-- agent-files:end -->/;

const escapeHtmlAttribute = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const agentBlock = (route: RouteSpec): string =>
  [
    '<!-- agent-files:start -->',
    `<link rel="canonical" href="${absoluteUrl(route.path)}">`,
    `<link rel="alternate" type="text/markdown" href="${absoluteUrl(twinPathOf(route, 'en'))}">`,
    `<link rel="alternate" type="text/markdown" hreflang="es" href="${absoluteUrl(twinPathOf(route, 'es'))}">`,
    '<!-- agent-files:end -->',
  ].join('\n');

// index.html is the only HTML source; a shell is wrong the moment a marker it
// expects disappears, so every replacement refuses anything but one match.
const replaceOnce = (html: string, pattern: RegExp, replacement: string, what: string): string => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = html.match(new RegExp(pattern.source, flags)) ?? [];
  if (matches.length !== 1) {
    throw new Error(`agent-files: expected exactly one ${what}, found ${matches.length}`);
  }

  return html.replace(pattern, () => replacement);
};

const replaceMeta = (
  html: string,
  attribute: 'name' | 'property',
  name: string,
  content: string,
): string =>
  replaceOnce(
    html,
    new RegExp(`<meta ${attribute}="${name}" content="[^"]*"\\s*/>`),
    `<meta ${attribute}="${name}" content="${escapeHtmlAttribute(content)}" />`,
    `meta ${name}`,
  );

export const injectAgentBlock = (html: string, route: RouteSpec): string =>
  replaceOnce(html, /<\/head>/, `${agentBlock(route)}\n</head>`, '</head>');

export const buildRouteShell = (rootHtml: string, route: RouteSpec): string => {
  let html = replaceOnce(rootHtml, BLOCK_PATTERN, agentBlock(route), 'agent-files block');
  html = replaceOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtmlAttribute(route.shellTitle)}</title>`,
    '<title>',
  );
  html = replaceMeta(html, 'name', 'description', route.shellDescription);
  html = replaceMeta(html, 'property', 'og:title', route.shellTitle);
  html = replaceMeta(html, 'property', 'og:description', route.shellDescription);
  html = replaceMeta(html, 'property', 'og:url', absoluteUrl(route.path));
  return html;
};
