import BigNumber from 'bignumber.js'
import { LotteryResponse, LotteryRound, LotteryRoundUserTickets } from 'state/types'

/**
 * Remove the '1' and reverse the digits in a lottery number retrieved from the smart contract
 */
export const parseRetrievedNumber = (number: string): string => {
  const numberAsArray = number.split('')
  numberAsArray.reverse()
  return numberAsArray.join('')
}

export const getDrawnDate = (locale: string, endTime: string) => {
  const endTimeInMs = parseInt(endTime, 10) * 1000
  const endTimeAsDate = new Date(endTimeInMs)
  return endTimeAsDate.toLocaleDateString(locale, dateTimeOptions)
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
}

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  ...timeOptions,
}

export const processLotteryResponse = (
  lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
  const {
    priceTicket: priceTicketAsString,
    discountDivisor: discountDivisorAsString,
    amountCollected: amountCollectedAsString,
  } = lotteryData

  const discountDivisor = new BigNumber(discountDivisorAsString)
  const priceTicket = new BigNumber(priceTicketAsString)
  const amountCollected = new BigNumber(amountCollectedAsString)

  return {
    isLoading: lotteryData.isLoading,
    lotteryId: lotteryData.lotteryId,
    userTickets: lotteryData.userTickets,
    status: lotteryData.status,
    startTime: lotteryData.startTime,
    endTime: lotteryData.endTime,
    priceTicket,
    discountDivisor,
    winnersPortion: lotteryData.winnersPortion,
    burnPortion: lotteryData.burnPortion,
    firstTicketId: lotteryData.firstTicketId,
    amountCollected,
    finalNumber: lotteryData.finalNumber,
    rewardPerUserPerBracket: lotteryData.rewardPerUserPerBracket,
    countWinnersPerBracket: lotteryData.countWinnersPerBracket,
    rewardsBreakdown: lotteryData.rewardsBreakdown,
  }
}
