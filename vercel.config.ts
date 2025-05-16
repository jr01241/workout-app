import { defineConfig } from 'vercel';

export default defineConfig({
  build: {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
  env: {
    DATABASE_URL: {
      type: 'text',
      required: true,
    },
    OPENAI_API_KEY: {
      type: 'text',
      required: true,
    },
  },
  output: 'standalone',
});
