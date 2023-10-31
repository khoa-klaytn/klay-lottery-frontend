import useSWRImmutable from 'swr/immutable'
import BigNumber from 'bignumber.js'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { MetricDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'

export interface ListType {
  address: string
  nickName: string
  metric: MetricDetail
  cakeBalance?: string
}

interface Leaderboard {
  isFetching: boolean
  list: ListType[]
}

const useLeaderboard = (): Leaderboard => {
  const klayPriceBusd = useKlayPrice()

  const { data, isLoading } = useSWRImmutable(
    klayPriceBusd.gt(0) && ['/affiliate-program-leaderboard', klayPriceBusd],
    async () => {
      const response = await fetch(`/api/affiliates-program/leader-board`)
      const result = await response.json()
      const list: ListType[] = result.affiliates.map((affiliate) => {
        const cakeBalance = new BigNumber(affiliate.metric.totalEarnFeeUSD).div(klayPriceBusd)
        return {
          ...affiliate,
          cakeBalance: cakeBalance.isNaN() ? '0' : cakeBalance.toString(),
        }
      })
      return list
    },
  )

  return {
    isFetching: isLoading,
    list: data ?? [],
  }
}

export default useLeaderboard
