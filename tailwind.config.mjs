/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';

const accent = {
  200: '#DB9DFF',
  600: '#93d7ff', // ライトテーマのボタン
  900: '#8E78FF',
  950: '#4B38A5',
};

const gray = {
  100: '#DB9DFF', // ライトテーマのバーの色
  200: '#FCF5FF',
  300: '#A8B1C2', // ダークテーマの文字色
  400: '#B4BDD0',
  500: '#251B38', // ライトテーマの説明文色
  700: '#16102C', // ライトテーマの文章色
  800: '#16102C', // ダークテーマの背景色
  900: '#0D0920', // ダークテーマの最も暗い色
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/starlight/**/*.{js,astro}',
    './node_modules/@astrojs/starlight-tailwind/**/*.{js,astro}',
  ],
  theme: {
    extend: {
      colors: { accent, gray },
    },
  },
  plugins: [starlightPlugin()],
};

