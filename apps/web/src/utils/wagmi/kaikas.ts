import { InjectedConnector } from 'wagmi/connectors/injected'
import { ConnectorNotFoundError } from 'wagmi'
import { EIP1193EventMap, ResourceUnavailableRpcError, UserRejectedRequestError, getAddress } from 'viem'
import { chains } from './configure'

type KaikasEventMap = EIP1193EventMap & {
  disconnected: EIP1193EventMap['disconnect']
  networkChanged: EIP1193EventMap['chainChanged']
}
type KaikasProvider = Exclude<Awaited<ReturnType<InjectedConnector['getProvider']>>, undefined> & {
  on<TEvent extends keyof KaikasEventMap>(event: TEvent, listener: KaikasEventMap[TEvent]): void
  removeListener<TEvent extends keyof KaikasEventMap>(event: TEvent, listener: KaikasEventMap[TEvent]): void
}

export default class KaikasConnector extends InjectedConnector {
  readonly id = 'kaikas'

  constructor() {
    super({
      chains: chains.filter((chain) => chain.id === 8217 || chain.id === 1001),
      options: {
        name: 'Kaikas',
        getProvider: () => (typeof window !== 'undefined' ? window.klaytn : undefined),
        shimDisconnect: false,
      },
    })
  }

  override async getProvider(): Promise<KaikasProvider> {
    const provider = (await super.getProvider()) as KaikasProvider
    return provider
  }

  override async connect({
    chainId,
  }: {
    chainId?: number
  } = {}): Promise<{ account: `0x${string}`; chain: { id: number; unsupported: boolean } }> {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('networkChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
        provider.on('disconnected', this.onDisconnect)
      }
      this.emit('message', { type: 'connecting' })
      const accounts = await (provider.request as any)({
        method: 'eth_requestAccounts',
      })
      const account = getAddress(accounts[0])
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }
      if (this.options.shimDisconnect) this.storage?.setItem(this.shimDisconnectKey, true)
      return { account, chain: { id, unsupported } }
    } catch (error) {
      if (!(error instanceof Error)) throw error
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error)
      if (!('code' in error)) throw error
      if (error.code === -32002) throw new ResourceUnavailableRpcError(error)
      throw error
    }
  }

  override async disconnect() {
    const provider = await this.getProvider()
    if (!provider?.removeListener) return
    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('networkChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
    provider.removeListener('disconnected', this.onDisconnect)
    if (this.options.shimDisconnect) this.storage?.removeItem(this.shimDisconnectKey)
  }
}
