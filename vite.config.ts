import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); //检查process.cwd()路径下环境文件
  return {
    plugins: [vue()],
    proxy: {
      // 不要和views中路径相同
      "/web": {
        target: env.VITE_PROXY_TARGET,
        changeOrigin: true
      },
      "/api/chat": {
        // target: "http://localhost:21400",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ' ')
      },

    },

  }
})
