# WXT Monorepo Template

A **pnpm workspace monorepo** for building one or more browser extensions using [WXT](https://wxt.dev/) with shared UI components and shared business logic.

## Structure

```
.
├── apps/
│   ├── extension-a/        # Extension A (blue theme)
│   └── extension-b/        # Extension B (green theme)
├── packages/
│   ├── config/             # Shared ESLint, TypeScript, Prettier configs
│   ├── shared/             # Shared logic: messaging, storage, logging, feature flags
│   └── ui/                 # Shared React components + Tailwind config
├── package.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9 — install with `npm install -g pnpm`

### Install dependencies

```bash
pnpm install
```

### Run a single extension in dev mode

```bash
pnpm dev:ext-a    # start Extension A
pnpm dev:ext-b    # start Extension B
```

### Run all extensions simultaneously

```bash
pnpm dev
```

### Build a single extension

```bash
pnpm build:ext-a    # outputs to apps/extension-a/.output/
pnpm build:ext-b    # outputs to apps/extension-b/.output/
```

### Build all extensions

```bash
pnpm build
```

### Lint, type-check, and format

```bash
pnpm lint
pnpm typecheck
pnpm format
```

---

## Loading an extension in Chrome

1. Run `pnpm build:ext-a` (or `:ext-b`).
2. Open Chrome → `chrome://extensions` → enable **Developer mode**.
3. Click **Load unpacked** → select `apps/extension-a/.output/chrome-mv3/` (or `extension-b`).

---

## Packages

### `packages/shared`

Cross-extension business logic. Import sub-paths for tree-shaking:

```ts
import { sendMessage, onMessage } from '@wxt-monorepo/shared/messaging';
import { storageGet, storageSet } from '@wxt-monorepo/shared/storage';
import { logger } from '@wxt-monorepo/shared/logging';
import { loadFlags, isEnabled } from '@wxt-monorepo/shared/feature-flags';
```

**Messaging API** — typed `sendMessage` / `onMessage` helpers built on `browser.runtime.sendMessage`. Add new message types by extending `MessageMap` in `packages/shared/src/messaging/index.ts`.

**Storage abstraction** — thin wrapper around `browser.storage.local/sync/session` with a simple `get/set/remove/clear` API plus a `onStorageChange` listener helper.

**Logger** — structured prefix logger with configurable minimum level and child loggers.

**Feature flags** — simple in-memory flags backed by `browser.storage.local`.

### `packages/ui`

Shared React components (Button, Card, Badge) styled with Tailwind CSS. Brand colours are CSS custom properties (`--color-brand-*`) so each extension can override them with a `style` prop.

### `packages/config`

Shared base configurations:

| File | Use |
|---|---|
| `tsconfig.base.json` | Extend in every package/app tsconfig |
| `eslint.config.js` | Import in app ESLint configs |
| `prettier.config.js` | Import at root Prettier config |

---

## Adding a New Extension

1. Copy `apps/extension-a` → `apps/extension-c`.
2. Update `apps/extension-c/package.json` (`name: "extension-c"`).
3. Update `apps/extension-c/wxt.config.ts` (extension name, description, permissions).
4. Add root scripts in `package.json`:
   ```json
   "dev:ext-c": "pnpm --filter extension-c dev",
   "build:ext-c": "pnpm --filter extension-c build"
   ```
5. Run `pnpm install` to link workspace packages.

---

## Per-Extension Overrides

| Concern | Where |
|---|---|
| Extension name / description / permissions | `apps/extension-*/wxt.config.ts` |
| Brand colours / theme tokens | CSS variables in each popup/options `App.tsx` |
| Feature flags defaults | `loadFlags({ ... })` call in `background.ts` |
| Icon files | `apps/extension-*/public/icon/{16,48,128}.png` |

---

## Tech Stack

- [WXT](https://wxt.dev/) — web extension framework
- [React 18](https://react.dev/) — UI
- [Tailwind CSS 3](https://tailwindcss.com/) — styling
- [TypeScript 5](https://www.typescriptlang.org/) — type safety
- [pnpm workspaces](https://pnpm.io/workspaces) — monorepo package manager
- [ESLint 9](https://eslint.org/) + [Prettier 3](https://prettier.io/) — code quality
