import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    // Use jsdom to simulate a browser environment for React component tests
    environment: 'jsdom',
    // Makes describe/test/expect available without importing them in every file
    globals: true,
    // Runs this file before every test file to set up custom matchers
    setupFiles: ['./src/tests/setup.js'],
    // Exclude node_modules from test scanning
    exclude: ['node_modules/**'],
  },
})
