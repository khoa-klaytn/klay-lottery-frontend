import { Currency, Price, WETH9 } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { KLAY, STABLE_COIN } from '@sweepstakes/tokens'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { multiplyPriceByAmount } from 'utils/prices'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { getFullDecimalMultiplier } from '@sweepstakes/utils/getFullDecimalMultiplier'
import { useActiveChainId } from './useActiveChainId'

type UseStablecoinPriceConfig = {
  enabled?: boolean
  hideIfPriceImpactTooHigh?: boolean
}
const DEFAULT_CONFIG: UseStablecoinPriceConfig = {
  enabled: true,
  hideIfPriceImpactTooHigh: false,
}

export function useStablecoinPrice(
  currency?: Currency | null,
  config: UseStablecoinPriceConfig = DEFAULT_CONFIG,
): Price<Currency, Currency> | undefined {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = currency?.chainId
  const { enabled } = { ...DEFAULT_CONFIG, ...config }

  const klayPrice = useKlayPrice()
  const stableCoin = chainId && chainId in ChainId ? STABLE_COIN[chainId as ChainId] : undefined
  const isCake = chainId && currency && KLAY[chainId] && currency.wrapped.equals(KLAY[chainId])

  const isStableCoin = currency && stableCoin && currency.wrapped.equals(stableCoin)

  const shouldEnabled = currency && stableCoin && enabled && currentChainId === chainId && !isCake && !isStableCoin

  const enableLlama = currency?.chainId === ChainId.ETHEREUM && shouldEnabled

  // we don't have too many AMM pools on ethereum yet, try to get it from api
  const { data: priceFromLlama } = useSWRImmutable<string>(
    currency && enableLlama && ['fiat-price-ethereum', currency],
    async () => {
      const address = currency?.isToken ? currency.address : WETH9[ChainId.ETHEREUM]?.address
      return fetch(`https://coins.llama.fi/prices/current/ethereum:${address}`) // <3 llama
        .then((res) => res.json())
        .then(
          (res) => res?.coins?.[`ethereum:${address}`]?.confidence > 0.9 && res?.coins?.[`ethereum:${address}`]?.price,
        )
    },
    {
      dedupingInterval: 30_000,
      refreshInterval: 30_000,
    },
  )

  const price = useMemo(() => {
    if (!currency || !stableCoin || !enabled) {
      return undefined
    }

    if (isCake && klayPrice) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals).times(klayPrice.toFixed(stableCoin.decimals)).toString(),
      )
    }

    // handle stable coin
    if (isStableCoin) {
      return new Price(stableCoin, stableCoin, '1', '1')
    }

    if (priceFromLlama && enableLlama) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals)
          .times(parseFloat(priceFromLlama).toFixed(stableCoin.decimals))
          .toString(),
      )
    }

    return undefined
  }, [currency, stableCoin, enabled, isCake, klayPrice, isStableCoin, priceFromLlama, enableLlama])

  return price
}

export const useStablecoinPriceAmount = (
  currency?: Currency | null,
  amount?: number,
  config?: UseStablecoinPriceConfig,
): number | undefined => {
  const stablePrice = useStablecoinPrice(currency, { enabled: !!currency, ...config })

  if (amount) {
    if (stablePrice) {
      return multiplyPriceByAmount(stablePrice, amount)
    }
  }
  return undefined
}
