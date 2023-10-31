import { defineConfig } from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] }), react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@sweepstakes/wagmi/connectors/binanceWallet': r('../../packages/wagmi/connectors/binanceWallet/index.ts'),
      '@sweepstakes/wagmi/connectors/blocto': r('../../packages/wagmi/connectors/blocto/index.ts'),
      '@sweepstakes/wagmi/connectors/miniProgram': r('../../packages/wagmi/connectors/miniProgram/index.ts'),
      '@sweepstakes/wagmi/connectors/trustWallet': r('../../packages/wagmi/connectors/trustWallet/index.ts'),
      '@sweepstakes/uikit': r('../../packages/uikit/src'),
      '@sweepstakes/localization': r('../../packages/localization/src'),
    },
  },
  test: {
    setupFiles: ['./vitest.setup.js'],
    environment: 'jsdom',
    globals: true,
    dangerouslyIgnoreUnhandledErrors: true, // wallet connect v2
    exclude: ['src/config/__tests__', 'node_modules'],
  },
})
