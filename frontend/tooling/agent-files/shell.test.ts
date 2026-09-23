import { describe, expect, it } from 'vitest';
import { HOME_ROUTE, ROUTES } from './routes';
import { buildRouteShell, injectAgentBlock } from './shell';

const INDEX_HTML = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="UTF-8" />',
  '<title>Gonzalo Martinez | Full Stack Developer & Web App Specialist</title>',
  '<meta name="description" content="Portfolio of Gonzalo Martinez." />',
  '<meta property="og:title" content="Gonzalo Martinez" />',
  '<meta property="og:description" content="Portfolio of Gonzalo Martinez." />',
  '<meta property="og:url" content="https://mi-portafolio-gonzalo.vercel.app/" />',
  '</head>',
  '<body></body>',
  '</html>',
].join('\n');

describe('injectAgentBlock', () => {
  it('adds the canonical address and the markdown alternates of the route', () => {
    const html = injectAgentBlock(INDEX_HTML, HOME_ROUTE);

    expect(html).toContain(
      '<link rel="canonical" href="https://mi-portafolio-gonzalo.vercel.app/">',
    );
    expect(html).toContain(
      '<link rel="alternate" type="text/markdown" href="https://mi-portafolio-gonzalo.vercel.app/index.md">',
    );
    expect(html).toContain(
      '<link rel="alternate" type="text/markdown" hreflang="es" href="https://mi-portafolio-gonzalo.vercel.app/index.es.md">',
    );
  });

  it('embeds valid Person structured data', () => {
    const html = injectAgentBlock(INDEX_HTML, HOME_ROUTE);
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    expect(match).not.toBeNull();

    const data = JSON.parse(match?.[1] ?? '') as {
      '@type': string;
      url: string;
      sameAs: string[];
    };
    expect(data['@type']).toBe('Person');
    expect(data.url).toBe('https://mi-portafolio-gonzalo.vercel.app/');
    expect(data.sameAs).toContain('https://github.com/gonzapersonalsite');
  });
});

describe('buildRouteShell', () => {
  it('replaces the block and metadata for the route', () => {
    const root = injectAgentBlock(INDEX_HTML, HOME_ROUTE);
    const shell = buildRouteShell(root, ROUTES[1]);

    expect(shell).toContain('<title>About Me | Gonzalo Martinez</title>');
    expect(shell).toContain('content="Learn about Gonzalo Martinez');
    expect(shell).toContain(
      '<link rel="canonical" href="https://mi-portafolio-gonzalo.vercel.app/about">',
    );
    expect(shell).toContain(
      'href="https://mi-portafolio-gonzalo.vercel.app/about/index.md"',
    );
    expect(shell).toContain(
      'href="https://mi-portafolio-gonzalo.vercel.app/about/index.es.md"',
    );
    expect(shell).toContain(
      '<meta property="og:url" content="https://mi-portafolio-gonzalo.vercel.app/about" />',
    );
    expect(shell).not.toContain(
      'href="https://mi-portafolio-gonzalo.vercel.app/index.md"',
    );
    expect(shell.match(/agent-files:start/g)).toHaveLength(1);
  });

  it('fails loudly when a marker is missing', () => {
    expect(() => buildRouteShell('<html><head></head></html>', ROUTES[1])).toThrow(
      /agent-files/,
    );
  });
});
