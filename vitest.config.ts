import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    threads: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'clover', 'lcov'],
      exclude: ['**/__tests__/**/*.*'],
    }
  },
});
