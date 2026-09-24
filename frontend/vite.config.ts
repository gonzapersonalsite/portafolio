import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'
// eslint-disable-next-line fsd-lint/no-relative-imports
import { agentFilesPlugin } from './tooling/agent-files/vitePlugin.ts'
// eslint-disable-next-line fsd-lint/no-relative-imports
import { fontPreloadPlugin } from './tooling/font-preload/vitePlugin.ts'
// eslint-disable-next-line fsd-lint/no-relative-imports
import pkg from './package.json' with { type: 'json' }

// Get current git commit hash
let commitHash = 'unknown'
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  console.warn('Could not get git commit hash, falling back to "unknown".')
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react(), fontPreloadPlugin(), agentFilesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Local only; `pnpm dev --host` exposes it on the LAN to test on a phone.
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // React and the router change only on upgrades, so this chunk stays cached across deploys.
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
              priority: 20,
            },
            // Only the MUI and Emotion code of the first render ($initial); components used by a
            // single page (Timeline, TextField, Dialog...) stay in that page's chunk.
            {
              name: 'mui-vendor',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              priority: 10,
              tags: ['$initial'],
            },
          ],
        },
      },
    },
  },
})
