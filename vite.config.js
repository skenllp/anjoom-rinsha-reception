import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Replaces %SITE_URL% in index.html at build time so Open Graph tags are STATIC
// (WhatsApp / Facebook crawlers do not run JavaScript).
function siteUrlPlugin(siteUrl) {
  return {
    name: 'inject-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let siteUrl =
    env.VITE_SITE_URL ||
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  siteUrl = siteUrl.replace(/\/$/, '');
  if (!siteUrl && mode === 'production') {
    console.warn(
      '\n[invitation] VITE_SITE_URL is not set. Open Graph URLs will be relative, ' +
        'which WhatsApp ignores. Set VITE_SITE_URL=https://your-domain in Vercel.\n'
    );
  }
  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
    build: { target: 'es2020', chunkSizeWarningLimit: 600 },
  };
});
