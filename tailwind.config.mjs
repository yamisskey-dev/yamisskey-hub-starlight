/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';

const accent = {
  200: '#D4D0FF',
  600: '#CC66FF', // ライトテーマのボタン
  900: '#372D7A',
  950: '#211F40',
};

const gray = {
  100: '#E6F8FF', // ライトテーマのバー色
  200: '#F4F6F8',
  300: '#A8B1C2',
  400: '#8490A5',
  500: '#362852', // ライトテーマの文章色
  700: '#251A3B',
  800: '#0F0A22', // ダークテーマのバー色
  900: '#0D0920', // ダークテーマの背景色
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/starlight/**/*.{js,astro}', // 追加
    './node_modules/@astrojs/starlight-tailwind/**/*.{js,astro}', // 追加
  ],
  theme: {
    extend: {
      colors: { accent, gray },
    },
  },
  plugins: [starlightPlugin()],
};

