import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量（注释掉未使用的变量，但保留加载环境的代码，以便未来可能的使用）
  loadEnv(mode, process.cwd());
  // const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      EnvironmentPlugin('all'),
    ],
    // 添加define配置，定义全局常量
    define: {
      // 确保所有值都使用JSON.stringify包装
      __APP_NAME__: JSON.stringify("HydroGem"),
      __IDEA__: JSON.stringify("HydroGem Water Monitoring"),
      __VERSION__: JSON.stringify("1.0.0")
    },
    server: {
      port: 5173,
      watch: {
        usePolling: true, // For Docker volumes on Windows/Mac
      },
      host: true,
    },
    preview: {
      port: 5173,
      host: true,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-tooltip',
        'class-variance-authority',
        'react-i18next',
        'i18next',
      ],
      exclude: ['@react-three/fiber'], // 这个包在运行时导入，不需要预先优化
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser', // 使用terser更彻底的压缩
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除console
          drop_debugger: true // 生产环境移除debugger
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // 将第三方库拆分到不同的块中
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': [
              '@radix-ui/react-tooltip',
              'class-variance-authority',
              'lucide-react'
            ],
            'i18n-vendor': ['react-i18next', 'i18next'],
          },
          // 为大型chunks添加hash以优化缓存
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        },
      },
      sourcemap: mode !== 'production', // 开发环境生成sourcemap，生产环境不生成
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 启用brotli和gzip压缩
      reportCompressedSize: false, // 禁用报告压缩大小以提高构建性能
    },
    // 为模块预加载添加链接预取
    experimental: {
      renderBuiltUrl(filename: string, { hostType }) {
        // 只在JS代码中应用动态资源路径，HTML中使用静态路径
        if (hostType === 'js') {
          return { runtime: `window.__assetsPath("${filename}")` };
        }
        // 对于HTML中的资源，使用相对路径
        return { relative: true };
      }
    },
    // 配置CSS优化
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `$env: ${mode};`
        }
      }
    },
    // 浏览器兼容性
    esbuild: {
      target: 'es2020',
      legalComments: 'none', // 移除注释
    },
    // 预渲染静态页面配置
    // 只在生产环境中使用
    ...(mode === 'production' && {
      ssr: {
        noExternal: ['react-router-dom', '@radix-ui/react-tooltip']
      }
    }),
  };
});