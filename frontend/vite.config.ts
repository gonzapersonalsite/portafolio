import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'
// eslint-disable-next-line fsd-lint/no-relative-imports
import { agentFilesPlugin } from './tooling/agent-files/vitePlugin.ts'
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
  plugins: [react(), agentFilesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 500,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    hmr: {
      clientPort: 5173,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replaceAll('\\', '/')
          if (/\/node_modules\/(react|react-dom|react-router-dom)\//.test(normalized)) return 'react-vendor'
          if (/\/node_modules\/@mui\//.test(normalized)) return 'mui-vendor'
          return undefined
        },
      },
    },
  },
})
