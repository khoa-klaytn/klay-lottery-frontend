import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchCurrentLottery, setLotteryIsTransitioning } from 'state/lottery'
import { usePublicClient } from 'hooks/usePublicClient'

const useNextEventCountdown = (nextEventTime: number): number => {
  const client = usePublicClient()
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
          dispatch(fetchCurrentLottery({ client, currentLotteryId }))
        }
        return prevSecondsRemaining - 1
      })
    }, 1000)

    return () => clearInterval(timer.current)
  }, [client, setSecondsRemaining, nextEventTime, currentLotteryId, timer, dispatch])

  return secondsRemaining
}

export default useNextEventCountdown
