import { onMessage, sendToTab } from '@wxt-monorepo/shared/messaging';
import { logger } from '@wxt-monorepo/shared/logging';
import { loadFlags } from '@wxt-monorepo/shared/feature-flags';

const log = logger.child('bg');

export default defineBackground(() => {
  log.info('Extension A background started');

  // Load feature flags on startup
  loadFlags({ newUi: true }).then((flags) => {
    log.debug('Feature flags loaded', flags);
  });

  // Handle PING messages
  onMessage('PING', async () => {
    log.debug('Received PING');
    return { pong: true };
  });

  // Handle LOG messages from content scripts / UI
  onMessage('LOG', async ({ level, message }) => {
    log[level](`[forwarded] ${message}`);
    return {};
  });

  // Handle GET_TAB_INFO — must come from a content script
  onMessage('GET_TAB_INFO', async (_payload, sender) => {
    const tabId = sender.tab?.id ?? -1;
    const url = sender.tab?.url ?? '';
    return { tabId, url };
  });
});
