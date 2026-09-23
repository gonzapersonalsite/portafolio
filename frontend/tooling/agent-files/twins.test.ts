import { describe, expect, it } from 'vitest';
import { buildTwin } from './twins';

describe('buildTwin', () => {
  it('renders the English home twin with hero, featured projects and page links', () => {
    const markdown = buildTwin('home', 'en');

    expect(markdown.startsWith('# Gonzalo Martinez\n')).toBe(true);
    expect(markdown).toContain('> Full Stack Developer');
    expect(markdown).toContain('## Featured Projects');
    expect(markdown).toContain('### Kanban Board App');
    expect(markdown).not.toContain('### NutriManager');
    expect(markdown).toContain('](/projects/index.md)');
  });

  it('renders Spanish content in the Spanish twins', () => {
    const markdown = buildTwin('home', 'es');

    expect(markdown).toContain('> Desarrollador Full Stack');
    expect(markdown).toContain('### Aplicación de Tablero Kanban');
    expect(markdown).toContain('](/projects/index.es.md)');
  });

  it('renders the about twin with sentence, competencies, languages and CV', () => {
    const markdown = buildTwin('about', 'en');

    expect(markdown).toContain('## A sentence that defines me');
    expect(markdown).toContain('## Core Competencies');
    expect(markdown).toContain('## Languages');
    expect(markdown).toContain('[Download CV](https://');
  });

  it('renders skills grouped by category', () => {
    const markdown = buildTwin('skills', 'en');

    expect(markdown.startsWith('# Technical Expertise\n')).toBe(true);
    expect(markdown).toContain('## Frontend');
    expect(markdown).toContain('- React — 80%');
  });

  it('renders experience entries with date range and bullet lists', () => {
    const markdown = buildTwin('experience', 'en');

    expect(markdown).toContain('### Internship – Higher Vocational Training (CFGS)');
    expect(markdown).toContain('Mistertransfer · 2025-03-24 — 2025-06-16');
    expect(markdown).toContain(
      '- Development and maintenance of software in a microservices environment.',
    );
    expect(markdown).toContain('— Present');
  });

  it('renders every project with its links', () => {
    const markdown = buildTwin('projects', 'es');

    expect(markdown).toContain('### Portafolio profesional');
    expect(markdown).toContain('- [Ver Demo](https://mi-portafolio-gonzalo.vercel.app/)');
    expect(markdown).toContain('- [Code](https://github.com/');
    expect(markdown).toContain('### Pokédex');
  });

  it('renders contact details and social links', () => {
    const markdown = buildTwin('contact', 'en');

    expect(markdown).toContain('](mailto:');
    expect(markdown).toContain('## FOLLOW ME');
    expect(markdown).toContain('- [GitHub](https://github.com/');
    expect(markdown).toContain('- [LinkedIn](http://www.linkedin.com/');
  });

  it('ends every twin with a single trailing newline', () => {
    for (const routeId of ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const) {
      for (const locale of ['en', 'es'] as const) {
        const markdown = buildTwin(routeId, locale);
        expect(markdown.endsWith('\n')).toBe(true);
        expect(markdown.endsWith('\n\n')).toBe(false);
        expect(markdown).not.toContain('\r');
      }
    }
  });
});
