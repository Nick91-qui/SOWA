import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    env: {
      NEXT_PUBLIC_API_URL: 'https://sowa.onrender.com',
    },
  },
});