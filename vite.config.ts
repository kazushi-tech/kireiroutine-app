import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'KireiRoutine',
        short_name: 'KireiRoutine',
        description: '掃除ルーティン完全表',
        theme_color: '#FDEDDC',
        icons: [
          {
            src: '/icons/icon-192x192.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/icons/icon-512x512.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      },
    }),
  ],
});
