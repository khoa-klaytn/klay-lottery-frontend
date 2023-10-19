import useSWR from 'swr'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { FetchStatus } from 'config/constants/types'
import { immutableMiddleware } from 'hooks/useSWRContract'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { usePublicClient } from 'wagmi'

const useIsRenderLotteryBanner = () => {
  const publicClient = usePublicClient()
  const { data: currentLotteryId, status: currentLotteryIdStatus } = useSWR(
    ['currentLotteryId'],
    fetchCurrentLotteryId,
    { refreshInterval: SLOW_INTERVAL, use: [immutableMiddleware] },
  )

  const { status: currentLotteryStatus } = useSWR(
    currentLotteryId ? ['currentLottery'] : null,
    async () => fetchLottery(publicClient, currentLotteryId.toString()),
    { refreshInterval: FAST_INTERVAL, use: [immutableMiddleware] },
  )

  return currentLotteryIdStatus === FetchStatus.Fetched && currentLotteryStatus === FetchStatus.Fetched
}

export default useIsRenderLotteryBanner
