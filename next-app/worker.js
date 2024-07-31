"use server"
import { createRequestHandler } from '@cloudflare/next-on-pages';

export default createRequestHandler({
  nextApp: {
    appDir: 'src',
  },
  dev: true,
});