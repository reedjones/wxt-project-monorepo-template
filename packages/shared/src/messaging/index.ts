/**
 * Typed messaging API for communication between
 * content scripts, background service worker, and UI pages.
 */

// ─── Message type registry ────────────────────────────────────────────────────

export interface MessageMap {
  /** Ping/pong for connection checks */
  PING: { request: Record<string, never>; response: { pong: true } };
  /** Get current tab info */
  GET_TAB_INFO: { request: Record<string, never>; response: { tabId: number; url: string } };
  /** Log a message via the background */
  LOG: { request: { level: LogLevel; message: string }; response: Record<string, never> };
}

export type MessageType = keyof MessageMap;
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export interface TypedMessage<T extends MessageType = MessageType> {
  type: T;
  payload: MessageMap[T]['request'];
}

export type TypedResponse<T extends MessageType> = MessageMap[T]['response'];

/**
 * Send a typed message to the background service worker.
 * Works from content scripts and popup/options pages.
 */
export async function sendMessage<T extends MessageType>(
  type: T,
  payload: MessageMap[T]['request'],
): Promise<TypedResponse<T>> {
  const message: TypedMessage<T> = { type, payload };
  return browser.runtime.sendMessage(message) as Promise<TypedResponse<T>>;
}

/**
 * Send a typed message to a specific tab's content script.
 * Works from the background service worker.
 */
export async function sendToTab<T extends MessageType>(
  tabId: number,
  type: T,
  payload: MessageMap[T]['request'],
): Promise<TypedResponse<T>> {
  const message: TypedMessage<T> = { type, payload };
  return browser.tabs.sendMessage(tabId, message) as Promise<TypedResponse<T>>;
}

/**
 * Register a typed message handler.
 * Returns an unsubscribe function.
 */
export function onMessage<T extends MessageType>(
  type: T,
  handler: (
    payload: MessageMap[T]['request'],
    sender: browser.runtime.MessageSender,
  ) => Promise<TypedResponse<T>> | TypedResponse<T>,
): () => void {
  const listener = (
    message: unknown,
    sender: browser.runtime.MessageSender,
    sendResponse: (response: unknown) => void,
  ): boolean => {
    if (
      message &&
      typeof message === 'object' &&
      (message as TypedMessage).type === type
    ) {
      const typedMsg = message as TypedMessage<T>;
      const result = handler(typedMsg.payload, sender);
      if (result instanceof Promise) {
        result.then(sendResponse).catch(console.error);
        return true; // async
      }
      sendResponse(result);
    }
    return false;
  };

  browser.runtime.onMessage.addListener(listener);
  return () => browser.runtime.onMessage.removeListener(listener);
}
