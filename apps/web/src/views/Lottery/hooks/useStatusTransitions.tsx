import { useAccount } from 'wagmi'
import { LotteryStatus } from 'config/constants/types'
import { usePreviousValue } from '@pancakeswap/hooks'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchPublicLotteries, fetchCurrentLotteryId, fetchUserLotteries } from 'state/lottery'
import { usePublicClient } from 'hooks/usePublicClient'

const useStatusTransitions = () => {
  const client = usePublicClient()
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()

  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const previousStatus = usePreviousValue(status)

  useEffect(() => {
    // Only run if there is a status state change
    if (previousStatus !== status && currentLotteryId) {
      // Current lottery transitions from CLOSE > CLAIMABLE
      if (previousStatus === LotteryStatus.CLOSE && status === LotteryStatus.CLAIMABLE) {
        dispatch(fetchPublicLotteries({ client, currentLotteryId }))
        if (account) {
          dispatch(fetchUserLotteries({ client, account, currentLotteryId }))
        }
      }
      // Previous lottery to new lottery. From CLAIMABLE (previous round) > OPEN (new round)
      if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.OPEN) {
        dispatch(fetchPublicLotteries({ client, currentLotteryId }))
        if (account) {
          dispatch(fetchUserLotteries({ client, account, currentLotteryId }))
        }
      }
    }
  }, [client, currentLotteryId, status, previousStatus, account, dispatch])

  useEffect(() => {
    // Current lottery is CLAIMABLE and the lottery is transitioning to a NEW round - fetch current lottery ID every 10s.
    // The isTransitioning condition will no longer be true when fetchCurrentLotteryId returns the next lottery ID
    if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.CLAIMABLE && isTransitioning) {
      dispatch(fetchCurrentLotteryId({ client }))
      dispatch(fetchPublicLotteries({ client, currentLotteryId }))
      const interval = setInterval(async () => {
        dispatch(fetchCurrentLotteryId({ client }))
        dispatch(fetchPublicLotteries({ client, currentLotteryId }))
      }, 10000)
      return () => clearInterval(interval)
    }
    return () => null
  }, [client, status, previousStatus, isTransitioning, currentLotteryId, dispatch])
}

export default useStatusTransitions
