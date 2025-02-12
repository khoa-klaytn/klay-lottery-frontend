import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { useGetLotteriesGraphData, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import fetchUnclaimedUserRewards from 'state/lottery/fetchUnclaimedUserRewards'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import useLotteryAddress from './useLotteryAddress'

const useGetUnclaimedRewards = () => {
  const lotteryAddress = useLotteryAddress()
  const publicClient = usePublicClient()
  const { address: account } = useAccount()
  const { isTransitioning, currentLotteryId } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteriesData = useGetLotteriesGraphData()
  const [unclaimedRewards, setUnclaimedRewards] = useState([])
  const [fetchStatus, setFetchStatus] = useState<TFetchStatus>(FetchStatus.Idle)

  useEffect(() => {
    // Reset on account change and round transition
    setFetchStatus(FetchStatus.Idle)
  }, [account, isTransitioning])

  const fetchAllRewards = async () => {
    setFetchStatus(FetchStatus.Fetching)
    const unclaimedRewardsResponse = await fetchUnclaimedUserRewards(
      lotteryAddress,
      publicClient,
      account,
      userLotteryData,
      lotteriesData,
      currentLotteryId,
    )
    setUnclaimedRewards(unclaimedRewardsResponse)
    setFetchStatus(FetchStatus.Fetched)
  }

  return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
