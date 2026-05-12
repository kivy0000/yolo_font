import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/web": {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
        "/api/chat": {
          target: "http://127.0.0.1:21400",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, ' '),
        },
      },
    },
  };
});