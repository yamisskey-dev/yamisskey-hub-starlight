/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';

// 紫系のアクセント。600 がリンク・ボタン、200/900 がダーク/ライトの強調色
const accent = {
  200: '#CFC4FF',
  600: '#6E54F0',
  900: '#4B38A5',
  950: '#2B2060',
};

// わずかに紫がかったニュートラルグレー（100 がライトの淡い背景、900 がダークの背景）
const gray = {
  100: '#F6F4FA',
  200: '#ECE9F3',
  300: '#D5D1E0',
  400: '#A49FB5',
  500: '#6F6984',
  600: '#4B4660',
  700: '#312C42',
  800: '#221E2E',
  900: '#17141F',
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
      fontFamily: {
        sans: ['Nunito', '"M PLUS Rounded 1c"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [starlightPlugin()],
};
