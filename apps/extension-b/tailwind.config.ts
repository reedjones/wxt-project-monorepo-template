import type { Config } from 'tailwindcss';
import baseConfig from '../../packages/ui/tailwind.config.ts';

const config: Config = {
  ...baseConfig,
  theme: {
    extend: {
      ...baseConfig.theme?.extend,
      colors: {
        ...(baseConfig.theme?.extend?.colors as Record<string, unknown>),
      },
    },
  },
};

export default config;
