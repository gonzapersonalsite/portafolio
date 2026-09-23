import type { Plugin } from 'vite';
import { buildAgentFiles } from './generate';
import { HOME_ROUTE, htmlFileOf, ROUTES } from './routes';
import { buildRouteShell, injectAgentBlock } from './shell';

export function agentFilesPlugin(): Plugin {
  return {
    name: 'portfolio-agent-files',
    enforce: 'post',
    configureServer(server) {
      const files = new Map(buildAgentFiles().map((file) => [file.path, file]));

      server.middlewares.use((request, response, next) => {
        const path = (request.url ?? '').split('?')[0];
        const file = files.get(path);
        if (file === undefined) {
          next();
          return;
        }

        response.setHeader('Content-Type', file.contentType);
        response.end(file.source);
      });
    },
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (index === undefined || index.type !== 'asset') {
        throw new Error('agent-files: index.html asset not found in the bundle');
      }

      const rootHtml = injectAgentBlock(index.source.toString(), HOME_ROUTE);
      index.source = rootHtml;

      for (const route of ROUTES) {
        if (route.id === HOME_ROUTE.id) continue;

        this.emitFile({
          type: 'asset',
          fileName: htmlFileOf(route),
          source: buildRouteShell(rootHtml, route),
        });
      }

      for (const file of buildAgentFiles()) {
        this.emitFile({
          type: 'asset',
          fileName: file.path.slice(1),
          source: file.source,
        });
      }
    },
  };
}
