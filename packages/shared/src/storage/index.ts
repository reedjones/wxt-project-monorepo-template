/**
 * Storage abstraction supporting chrome.storage / browser.storage with a simple API.
 */

export type StorageArea = 'local' | 'sync' | 'session';

export interface StorageOptions {
  area?: StorageArea;
}

/**
 * Get a value from browser storage.
 */
export async function storageGet<T>(key: string, options: StorageOptions = {}): Promise<T | null> {
  const area = options.area ?? 'local';
  const result = await browser.storage[area].get(key);
  return (result[key] as T) ?? null;
}

/**
 * Set a value in browser storage.
 */
export async function storageSet<T>(
  key: string,
  value: T,
  options: StorageOptions = {},
): Promise<void> {
  const area = options.area ?? 'local';
  await browser.storage[area].set({ [key]: value });
}

/**
 * Remove a value from browser storage.
 */
export async function storageRemove(key: string, options: StorageOptions = {}): Promise<void> {
  const area = options.area ?? 'local';
  await browser.storage[area].remove(key);
}

/**
 * Clear all values in a storage area.
 */
export async function storageClear(options: StorageOptions = {}): Promise<void> {
  const area = options.area ?? 'local';
  await browser.storage[area].clear();
}

/**
 * Subscribe to storage changes.
 */
export function onStorageChange(
  key: string,
  callback: (newValue: unknown, oldValue: unknown) => void,
  options: StorageOptions = {},
): () => void {
  const area = options.area ?? 'local';
  const listener = (
    changes: Record<string, browser.storage.StorageChange>,
    changedArea: string,
  ) => {
    if (changedArea === area && key in changes) {
      const change = changes[key];
      if (change) {
        callback(change.newValue, change.oldValue);
      }
    }
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}
