import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: false,
      reporter: ['text', 'cobertura'],
    },
  },
})
