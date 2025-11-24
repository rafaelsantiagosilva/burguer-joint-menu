import { defineConfig } from 'vitest/config';
import isconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [isconfigPaths()],
});