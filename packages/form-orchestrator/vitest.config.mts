import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,mts,ts,mjs}'], 
  },
  define: { 
    'import.meta.vitest': 'undefined', 
  },
})