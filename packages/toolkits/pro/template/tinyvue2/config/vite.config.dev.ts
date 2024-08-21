import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

const proxyConfig = {
  '/api': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/mock': {
    target: 'http://127.0.0.1:8848',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/mock/, ''),
  },
};

export default mergeConfig(baseConfig, {
  server: {
    proxy: {
      ...proxyConfig,
    },
  },
});
