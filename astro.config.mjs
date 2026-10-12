import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'やみはぶ',
      defaultLocale: 'root',
      locales: {
        root: { label: '日本語', lang: 'ja' },
      },
      logo: {
        src: './src/assets/logo.webp', // Add the logo for the site header
      },
      social: {
        github: 'https://github.com/yamisskey-dev',
      },
      editLink: {
        baseUrl: 'https://github.com/yamisskey-dev/yamisskey-hub-starlight/edit/main/',
      },
      sidebar: [
        {
          label: 'ガイド',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'リファレンス',
          autogenerate: { directory: 'reference' },
        },
      ],
      components: {
        Header: './src/components/starlight/Header.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        Hero: './src/components/starlight/Hero.astro',
        Footer: './src/components/starlight/Footer.astro',
      },
      customCss: [
        // Path to your Tailwind base styles:
        './src/tailwind.css',
        // misskey-hub-next 風のテーマ
        './src/styles/theme.css',
      ],
    }),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false,
    }),
  ],
  site: 'https://hub.yami.ski', // Set your site URL here
});
