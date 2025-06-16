import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isDebug = mode === 'development';

  return {
    mode,
    root: './src',
    publicDir: './public',
    assetsInclude: './public',
    plugins: [tsconfigPaths()],
    esbuild: {
      drop: isDebug ? [] : ['debugger', 'console'],
    },
  };
});
