import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import svelte from '@astrojs/svelte'
import AstroPWA from '@vite-pwa/astro'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    svelte(),
    AstroPWA({
      base: '/',
      scope: '/',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
    }),
  ],
})
