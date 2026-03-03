import { onMessage } from '@wxt-monorepo/shared/messaging';
import { logger } from '@wxt-monorepo/shared/logging';
import { loadFlags } from '@wxt-monorepo/shared/feature-flags';

const log = logger.child('bg-b');

export default defineBackground(() => {
  log.info('Extension B background started');

  loadFlags({ betaFeature: false }).then((flags) => {
    log.debug('Feature flags loaded', flags);
  });

  onMessage('PING', async () => {
    log.debug('Received PING');
    return { pong: true };
  });

  onMessage('LOG', async ({ level, message }) => {
    log[level](`[forwarded] ${message}`);
    return {};
  });

  onMessage('GET_TAB_INFO', async (_payload, sender) => {
    const tabId = sender.tab?.id ?? -1;
    const url = sender.tab?.url ?? '';
    return { tabId, url };
  });
});
