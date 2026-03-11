/**
 * Simple feature flag system backed by browser.storage.
 */

import { storageGet, storageSet } from '../storage/index.js';

export type FeatureFlags = Record<string, boolean>;

const FLAGS_KEY = '__feature_flags__';

let cachedFlags: FeatureFlags = {};

/**
 * Load feature flags from storage into the in-memory cache.
 */
export async function loadFlags(defaults: FeatureFlags = {}): Promise<FeatureFlags> {
  const stored = await storageGet<FeatureFlags>(FLAGS_KEY);
  cachedFlags = { ...defaults, ...(stored ?? {}) };
  return cachedFlags;
}

/**
 * Check if a feature flag is enabled.
 */
export function isEnabled(flag: string): boolean {
  return cachedFlags[flag] ?? false;
}

/**
 * Enable or disable a feature flag and persist it.
 */
export async function setFlag(flag: string, enabled: boolean): Promise<void> {
  cachedFlags[flag] = enabled;
  await storageSet(FLAGS_KEY, cachedFlags);
}

/**
 * Get all current feature flags.
 */
export function getAllFlags(): FeatureFlags {
  return { ...cachedFlags };
}
