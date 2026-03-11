import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Extension A',
    description: 'My first WXT monorepo extension',
    version: '0.0.1',
    permissions: ['storage', 'tabs', 'activeTab'],
    host_permissions: ['<all_urls>'],
    icons: {
      '16': '/icon/16.png',
      '48': '/icon/48.png',
      '128': '/icon/128.png',
    },
    action: {
      default_popup: 'popup.html',
      default_icon: '/icon/48.png',
    },
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [],
      },
    },
  }),
});
