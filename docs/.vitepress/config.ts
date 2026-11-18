import { resolve } from 'node:path'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig, type DefaultTheme } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

const site = {
  title: 'Awesome Temporary Root',
  description:
    'Temporary-root hardware reports, kernel loaders, late-load modules, setup, and safety guidance for locked Android bootloaders.',
  hostname: 'https://awesome-temporary-root.pages.dev',
  themeColor: '#0f766e',
} as const

const devicePages = [
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
  { text: 'Amazon, NVIDIA, Meta, Meizu, Rokid, and TCL', link: '/devices/other' },
] satisfies DefaultTheme.NavItem[]

const deviceNavItems = [
  { text: 'All Supported Devices', link: '/devices/' },
  ...devicePages,
] satisfies DefaultTheme.NavItem[]

const deviceSidebarItems = [
  { text: 'All Brands and Statuses', link: '/devices/' },
  ...devicePages,
] satisfies DefaultTheme.SidebarItem[]

const guideSections = [
  { text: 'What Is Temporary Root?', link: '/guide#what-is-temporary-root' },
  { text: 'Tools and Managers', link: '/guide#tools-and-managers' },
  { text: 'Firmware and Recovery', link: '/guide#firmware-and-recovery-resources' },
  { text: 'Research Resources', link: '/guide#research-resources' },
  { text: 'Quick Start', link: '/guide#quick-start' },
  { text: 'Troubleshooting and FAQ', link: '/guide#troubleshooting-and-faq' },
  { text: 'Contributing and Disclaimer', link: '/guide#contributing-and-disclaimer' },
  { text: 'Sources', link: '/guide#sources' },
] satisfies DefaultTheme.SidebarItem[]

const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide' },
  { text: 'Devices', items: deviceNavItems },
  { text: 'Tools and Managers', link: '/guide#tools-and-managers' },
  { text: 'Modules and Apps', link: '/modules/' },
  { text: 'Quick Start', link: '/guide#quick-start' },
  { text: 'FAQ', link: '/guide#troubleshooting-and-faq' },
]

const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Overview',
    items: [
      { text: 'Home', link: '/' },
      { text: 'Complete Guide', link: '/guide' },
      { text: 'Modules and Apps', link: '/modules/' },
    ],
  },
  { text: 'Supported Devices', items: deviceSidebarItems },
  { text: 'Guide Sections', items: guideSections },
]

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: site.title,
    description: site.description,
    cleanUrls: true,
    outDir: resolve(import.meta.dirname, '../../dist'),
    sitemap: {
      hostname: site.hostname,
    },
    head: [
      ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      ['meta', { property: 'og:title', content: site.title }],
      ['meta', { property: 'og:description', content: site.description }],
      [
        'meta',
        {
          name: 'google-site-verification',
          content: 'yh6OZ9qZhOAVRs3tkFAwwBYIb3BKrveBy6C0QEVHpw0',
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
          domain: site.hostname,
          sidebar: [
            {
              text: 'Overview',
              items: [
                { text: 'Complete Guide', link: '/guide' },
                { text: 'Modules and Apps', link: '/modules/' },
              ],
            },
            { text: 'Supported Devices', items: deviceSidebarItems },
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
      nav,
      sidebar,
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
        name: site.title,
        short_name: 'Temp Root',
        description:
          'Temporary-root hardware reports, kernel loaders, late-load modules, and safety guidance for locked Android bootloaders.',
        theme_color: site.themeColor,
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
