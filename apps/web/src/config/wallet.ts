import { WalletConfigV2 } from '@sweepstakes/ui-wallets'
import { walletConnectNoQrCodeConnector } from '../utils/wagmi'

export enum ConnectorNames {
  Kaikas = 'kaikas',
  MetaMask = 'metaMask',
}

const createQrCode = (chainId: number, connect) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId })

  const r = await walletConnectNoQrCodeConnector.getProvider()
  return new Promise<string>((resolve) => {
    r.on('display_uri', (uri) => {
      resolve(uri)
    })
  })
}

const isKaikasInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.klaytn?.isKaikas) {
    return true
  }

  return false
}

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.ethereum?.isMetaMask) {
    return true
  }

  if (window.ethereum?.providers?.some((p) => p.isMetaMask)) {
    return true
  }

  return false
}

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number
  connect: (connectorID: ConnectorNames) => void
}): WalletConfigV2<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect)
  return [
    {
      id: ConnectorNames.Kaikas,
      title: 'Kaikas',
      icon: '/images/wallets/kaikas.svg',
      get installed() {
        return isKaikasInstalled()
      },
      connectorId: ConnectorNames.Kaikas,
      downloadLink: 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi',
    },
    {
      id: ConnectorNames.MetaMask,
      title: 'Metamask',
      icon: '/images/wallets/metamask.png',
      get installed() {
        return isMetamaskInstalled()
        // && metaMaskConnector.ready
      },
      connectorId: ConnectorNames.MetaMask,
      deepLink: 'https://metamask.app.link/dapp/sweepstakes.finance/',
      qrCode,
      downloadLink: 'https://metamask.app.link/dapp/sweepstakes.finance/',
    },
  ]
}

export const createWallets = (chainId: number, connect: any) => {
  const config = walletsConfig({ chainId, connect })
  return config
}

const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `https://docs.sweepstakes.finance/v/${docLangCodeMapping[code]}/get-started/wallet-guide`
    : `https://docs.sweepstakes.finance/get-started/wallet-guide`
