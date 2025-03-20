import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import reactNativeWeb from 'vite-plugin-react-native-web';

// Explicit path declarations for Windows compatibility
const reactNativeWebPath = path.resolve(__dirname, 'node_modules/react-native-web');
const expoAssetRegistryPath = path.resolve(__dirname, 'node_modules/expo-asset/build/AssetRegistry.js');
const randomValuesPath = path.resolve(__dirname, 'node_modules/react-native-get-random-values');

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,tsx,js,ts}',
      babel: {
        plugins: [
          [
            'babel-plugin-module-resolver',
            {
              alias: {
                'react-native': reactNativeWebPath,
                'react-native-get-random-values': randomValuesPath,
                '@react-native/assets-registry/registry': expoAssetRegistryPath
              }
            }
          ]
        ],
        presets: ['@babel/preset-react']
      }
    }),
    reactNativeWeb()
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './yourapp/src'),
      'react-native': reactNativeWebPath,
      'react-native-web': reactNativeWebPath,
      'react-native-get-random-values': randomValuesPath,
      '@react-native/assets-registry/registry': expoAssetRegistryPath,
      'react-native/Libraries/Image/AssetRegistry': expoAssetRegistryPath,
      'buffer': path.resolve(__dirname, 'node_modules/buffer/'),
      'process': path.resolve(__dirname, 'node_modules/process/')
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json'
    ]
  },
  optimizeDeps: {
    include: [
      'react-native-get-random-values',
      'buffer',
      'process',
      'react-native-web'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.jsx': 'jsx'
      },
      define: {
        global: 'window',
        globalThis: 'window',
        self: 'window',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production')
      }
    },
    exclude: [
      'react-native',
      'expo-asset',
      'react-native-svg'
    ]
  },
  define: {
    'process.env': {},
    global: 'window',
    'window.__DEV__': JSON.stringify(true),
    'window.__METRO_GLOBAL_PREFIX__': JSON.stringify('')
  },
  server: {
    watch: {
      usePolling: true // Recommended for Windows/WSL2
    }
  }
});
