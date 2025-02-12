import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchCurrentLottery, setLotteryIsTransitioning } from 'state/lottery'
import { usePublicClient } from 'wagmi'
import useLotteryAddress from './useLotteryAddress'

const useNextEventCountdown = (nextEventTime: number): number => {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const dispatch = useAppDispatch()
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const timer = useRef(null)
  const { currentLotteryId } = useLottery()

  useEffect(() => {
    dispatch(setLotteryIsTransitioning({ isTransitioning: false }))
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime - currentSeconds
    setSecondsRemaining(secondsRemainingCalc)

    timer.current = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => {
        // Clear current interval at end of countdown and fetch current lottery to get updated state
        if (prevSecondsRemaining <= 1) {
          clearInterval(timer.current)
          dispatch(setLotteryIsTransitioning({ isTransitioning: true }))
          dispatch(fetchCurrentLottery({ publicClient, lotteryAddress, currentLotteryId }))
        }
        return prevSecondsRemaining - 1
      })
    }, 1000)

    return () => clearInterval(timer.current)
  }, [publicClient, lotteryAddress, setSecondsRemaining, nextEventTime, currentLotteryId, timer, dispatch])

  return secondsRemaining
}

export default useNextEventCountdown
