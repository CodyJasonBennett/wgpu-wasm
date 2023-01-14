import { defineConfig } from 'vite'
import * as pkg from './package.json'

export default defineConfig({
  build: {
    minify: false,
    target: 'es2018',
    lib: {
      formats: ['cjs', 'es'],
      entry: 'src/index.ts',
      fileName: '[name]',
    },
    rollupOptions: {
      external: (id: string) => id in pkg.dependencies,
    },
  },
})
