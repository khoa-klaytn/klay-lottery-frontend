import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@sweepstakes/localization'
import { useMemo } from 'react'

interface LotteryEvent {
  nextEventTime: number
  postCountdownText?: string
  preCountdownText?: string
}

const vrfRequestTime = 15
const transactionResolvingBuffer = 5 // Delay countdown to ensure contract transactions have been calculated and broadcast

const useGetNextLotteryEvent = (endTime: number, status: LotteryStatus): LotteryEvent => {
  const { t } = useTranslation()
  return useMemo(() => {
    switch (status) {
      case LotteryStatus.OPEN:
        return {
          nextEventTime: endTime + transactionResolvingBuffer,
          preCountdownText: null,
          postCountdownText: t('until the draw'),
        }
      case LotteryStatus.CLOSE:
        return {
          nextEventTime: endTime + transactionResolvingBuffer + vrfRequestTime,
          preCountdownText: t('Winners announced in'),
          postCountdownText: null,
        }
      case LotteryStatus.CLAIMABLE:
        const nextEventTime = new Date()
        nextEventTime.setUTCHours(2, 0, 0, 0)
        const time = nextEventTime.getTime()
        if (time < Date.now()) {
          return { nextEventTime: null, preCountdownText: null, postCountdownText: null }
        }
        return {
          nextEventTime: time / 1000,
          preCountdownText: t('Tickets on sale in'),
          postCountdownText: null,
        }
      default:
        return { nextEventTime: null, preCountdownText: null, postCountdownText: null }
    }
  }, [endTime, status, t])
}

export default useGetNextLotteryEvent
