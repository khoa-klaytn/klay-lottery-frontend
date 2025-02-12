import { BinanceWalletConnector } from '@sweepstakes/wagmi/connectors/binanceWallet'
import { BloctoConnector } from '@sweepstakes/wagmi/connectors/blocto'
import { TrustWalletConnector } from '@sweepstakes/wagmi/connectors/trustWallet'
import memoize from 'lodash/memoize'
import { createConfig, createStorage } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import KaikasConnector from './kaikas'
import { chains, publicClient } from './configure'

export { chains, publicClient }

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const kaikasConnector = new KaikasConnector()

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'SweepStakes',
    appLogoUrl: 'https://sweepstakes.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    showQrModal: true,
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    showQrModal: false,
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: 56,
    appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
  },
})

const ledgerConnector = new LedgerConnector({
  chains,
  options: {
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const bscConnector = new BinanceWalletConnector({ chains })

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const noopStorage = {
  getItem: (_key) => '',
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
}

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v1.1',
  }),
  autoConnect: false,
  publicClient,
  connectors: [
    kaikasConnector,
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
    // @ts-ignore FIXME: wagmi
    bloctoConnector,
    ledgerConnector,
    trustWalletConnector,
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})
