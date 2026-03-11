import { sendMessage } from '@wxt-monorepo/shared/messaging';
import { logger } from '@wxt-monorepo/shared/logging';

const log = logger.child('content-a');

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    log.info('Extension A content script running', { url: window.location.href });

    // Example: ping background on load
    try {
      const response = await sendMessage('PING', {});
      log.debug('Background pong received', response);
    } catch (err) {
      log.error('Failed to ping background', { err });
    }
  },
});
