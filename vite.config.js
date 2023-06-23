import { defineConfig } from 'vite';


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        page1: './pages/watchlist.html',
      },
    },
  },
});