/* eslint-disable consistent-return */
import { useTranslation } from '@sweepstakes/localization'
import { useToast } from '@sweepstakes/uikit'
import { useCallback, useMemo } from 'react'
import replaceBrowserHistory from '@sweepstakes/utils/replaceBrowserHistory'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ExtendEthereum } from 'global'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()
  return useCallback(
    (chainId: number) => {
      setSessionChainId(chainId)
      replaceBrowserHistory('chain', CHAIN_QUERY_NAME[chainId])
    },
    [setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    switchNetworkAsync: _switchNetworkAsync,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { isConnected } = useAccount()

  const switchNetworkAsyncIsFn = useMemo(() => typeof _switchNetworkAsync === 'function', [_switchNetworkAsync])
  const canSwitch = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (!isConnected) return true
    if (!switchNetworkAsyncIsFn) return false
    if ((window.ethereum as ExtendEthereum)?.isSafePal || (window.ethereum as ExtendEthereum)?.isMathWallet)
      return false
    return true
  }, [switchNetworkAsyncIsFn, isConnected])

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      try {
        const c = await _switchNetworkAsync(chainId)
        // well token pocket
        if (window.ethereum?.isTokenPocket === true) {
          switchNetworkLocal(chainId)
          window.location.reload()
        }
        return c
      } catch {
        // TODO: review the error
        toastError(t('Error connecting, please retry and confirm in wallet!'))
      } finally {
        setLoading(false)
      }
    },
    [_switchNetworkAsync, toastError, t, setLoading, switchNetworkLocal],
  )
  const switchNetworkMaybeAsync = useCallback(
    (chainId: number) => {
      if (!canSwitch) return
      if (isConnected && switchNetworkAsyncIsFn) {
        setLoading(true)
        switchNetworkAsync(chainId)
      }

      switchNetworkLocal(chainId)
    },
    [isConnected, canSwitch, switchNetworkLocal, switchNetworkAsync, switchNetworkAsyncIsFn, setLoading],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork(chainId)
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync: switchNetworkMaybeAsync,
    isLoading: loading,
    canSwitch,
  }
}
