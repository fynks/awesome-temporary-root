import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

const configDir = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(configDir, '../../dist')

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: 'Awesome Temporary Root',
    description:
      'Temporary-root hardware reports, kernel loaders, late-load modules, setup, and safety guidance for locked Android bootloaders.',
    cleanUrls: true,
    outDir,
    sitemap: {
      hostname: 'https://awesome-temporary-root.pages.dev',
    },
    head: [
      ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      [
        'meta',
        {
          property: 'og:title',
          content: 'Awesome Temporary Root',
        },
      ],
      [
        'meta',
        {
          property: 'og:description',
          content:
            'Temporary-root hardware reports, kernel loaders, late-load modules, setup, and safety guidance for locked Android bootloaders.',
        },
      ],
    ],
    markdown: {
      config(md) {
        md.use(copyOrDownloadAsMarkdownButtons)
      },
    },
    vite: {
      plugins: [
        llmstxt({
          domain: 'https://awesome-temporary-root.pages.dev',
          sidebar: [
            {
              text: 'Overview',
              items: [
                { text: 'Complete Guide', link: '/guide' },
                { text: 'Modules and Apps', link: '/modules/' },
              ],
            },
            {
              text: 'Supported Devices',
              items: [
                { text: 'All Brands and Statuses', link: '/devices/' },
                { text: 'Samsung Galaxy', link: '/devices/samsung' },
                { text: 'Google Pixel', link: '/devices/pixel' },
                { text: 'OnePlus', link: '/devices/oneplus' },
                { text: 'OPPO', link: '/devices/oppo' },
                { text: 'Realme', link: '/devices/realme' },
                { text: 'vivo and iQOO', link: '/devices/vivo' },
                { text: 'Xiaomi and Redmi', link: '/devices/xiaomi' },
                { text: 'ASUS', link: '/devices/asus' },
                { text: 'Nothing', link: '/devices/nothing' },
                { text: 'Honor', link: '/devices/honor' },
                { text: 'HMD and Nokia', link: '/devices/nokia' },
                { text: 'Amazon, NVIDIA, Meta, and TCL', link: '/devices/other' },
              ],
            },
          ],
        }),
      ],
      server: {
        allowedHosts: true,
      },
      preview: {
        allowedHosts: true,
      },
    },
    themeConfig: {
      logo: {
        light: '/images/ghost-light.svg',
        dark: '/images/ghost-dark.svg',
        alt: 'Awesome Temporary Root ghost emblem',
      },
      search: {
        provider: 'local',
      },
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide' },
        {
          text: 'Devices',
          items: [
            { text: 'All Supported Devices', link: '/devices/' },
            { text: 'Samsung Galaxy', link: '/devices/samsung' },
            { text: 'Google Pixel', link: '/devices/pixel' },
            { text: 'OnePlus', link: '/devices/oneplus' },
            { text: 'OPPO', link: '/devices/oppo' },
            { text: 'Realme', link: '/devices/realme' },
            { text: 'vivo and iQOO', link: '/devices/vivo' },
            { text: 'Xiaomi and Redmi', link: '/devices/xiaomi' },
            { text: 'ASUS', link: '/devices/asus' },
            { text: 'Nothing', link: '/devices/nothing' },
            { text: 'Honor', link: '/devices/honor' },
            { text: 'HMD and Nokia', link: '/devices/nokia' },
            { text: 'Amazon, NVIDIA, Meta, and TCL', link: '/devices/other' },
          ],
        },
        { text: 'Tools and Managers', link: '/guide#tools-and-managers' },
        { text: 'Modules and Apps', link: '/modules/' },
        { text: 'Quick Start', link: '/guide#quick-start' },
        { text: 'FAQ', link: '/guide#troubleshooting-and-faq' },
      ],
      sidebar: [
        {
          text: 'Overview',
          items: [
            { text: 'Home', link: '/' },
            { text: 'Complete Guide', link: '/guide' },
            { text: 'Modules and Apps', link: '/modules/' },
          ],
        },
        {
          text: 'Supported Devices',
          items: [
            { text: 'All Brands and Statuses', link: '/devices/' },
            { text: 'Samsung Galaxy', link: '/devices/samsung' },
            { text: 'Google Pixel', link: '/devices/pixel' },
            { text: 'OnePlus', link: '/devices/oneplus' },
            { text: 'OPPO', link: '/devices/oppo' },
            { text: 'Realme', link: '/devices/realme' },
            { text: 'vivo and iQOO', link: '/devices/vivo' },
            { text: 'Xiaomi and Redmi', link: '/devices/xiaomi' },
            { text: 'ASUS', link: '/devices/asus' },
            { text: 'Nothing', link: '/devices/nothing' },
            { text: 'Honor', link: '/devices/honor' },
            { text: 'HMD and Nokia', link: '/devices/nokia' },
            { text: 'Amazon, NVIDIA, Meta, and TCL', link: '/devices/other' },
          ],
        },
        {
          text: 'Guide Sections',
          items: [
            { text: 'What Is Temporary Root?', link: '/guide#what-is-temporary-root' },
            { text: 'Tools and Managers', link: '/guide#tools-and-managers' },
            { text: 'Firmware and Recovery', link: '/guide#firmware-and-recovery-resources' },
            { text: 'Research Resources', link: '/guide#research-resources' },
            { text: 'Quick Start', link: '/guide#quick-start' },
            { text: 'Troubleshooting and FAQ', link: '/guide#troubleshooting-and-faq' },
            { text: 'Contributing and Disclaimer', link: '/guide#contributing-and-disclaimer' },
            { text: 'Sources', link: '/guide#sources' },
          ],
        },
      ],
      outline: {
        level: [2, 3],
        label: 'On this page',
      },
      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/fynks/awesome-temporary-root',
        },
      ],
      footer: {
        message: 'MIT Licensed. Use only on hardware you own or are authorized to modify.',
      },
    },
    pwa: {
      registerType: 'autoUpdate',
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      manifest: {
        name: 'Awesome Temporary Root',
        short_name: 'Temp Root',
        description:
          'Temporary-root hardware reports, kernel loaders, late-load modules, and safety guidance for locked Android bootloaders.',
        theme_color: '#0f766e',
        background_color: '#0b0f19',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      generateSW: {
        globPatterns: ['**/*.{css,js,html,svg,ico,woff2,txt}'],
      },
    },
  }),
)
