/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';

// Generated color palettes
const accent = { 200: '#c3c4f0', 600: '#6355cf', 900: '#2e295e', 950: '#211f40' };
const gray = { 100: '#f8f4fe', 200: '#f2e9fd', 300: '#c7bdd5', 400: '#9581ae', 500: '#614e78', 700: '#412e55', 800: '#2f1c42', 900: '#1c1425' };

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: { accent, gray },
    },
  },
  plugins: [starlightPlugin()],
};
