import { defineConfig } from 'vitest/config';
import isconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [isconfigPaths()],
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup/env.ts', './tests/setup/db.ts']
  }
});