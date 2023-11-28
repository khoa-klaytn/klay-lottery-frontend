import { useEffect, useMemo } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { useSelector, batch } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
import { State } from '../types'
import {
  fetchCurrentLotteryIdThunk,
  fetchMaxBuyThunk,
  fetchCurrentLottery,
  fetchUserTicketsAndLotteries,
  fetchPublicLotteries,
} from '.'
import { makeLotteryGraphDataByIdSelector, lotterySelector } from './selectors'

// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteryGraphDataByIdSelector = useMemo(() => makeLotteryGraphDataByIdSelector(lotteryId), [lotteryId])
  return useSelector(lotteryGraphDataByIdSelector)
}

export const useFetchLottery = (fetchPublicDataOnly = false) => {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()

  useEffect(() => {
    dispatch(fetchCurrentLotteryIdThunk({ publicClient, lotteryAddress }))
    dispatch(fetchMaxBuyThunk({ publicClient, lotteryAddress }))
  }, [publicClient, lotteryAddress, dispatch])

  useSlowRefreshEffect(() => {
    if (currentLotteryId) {
      batch(() => {
        // Get historical lottery data from nodes +  last 100 subgraph entries
        dispatch(fetchPublicLotteries({ publicClient, lotteryAddress, currentLotteryId }))
        // get public data for current lottery
        dispatch(fetchCurrentLottery({ publicClient, lotteryAddress, currentLotteryId }))
      })
    }
  }, [publicClient, lotteryAddress, dispatch, currentLotteryId])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId && !fetchPublicDataOnly) {
      dispatch(fetchUserTicketsAndLotteries({ publicClient, lotteryAddress, account, currentLotteryId }))
    }
  }, [publicClient, lotteryAddress, dispatch, currentLotteryId, account, fetchPublicDataOnly])
}

export const useLottery = () => {
  return useSelector(lotterySelector)
}
