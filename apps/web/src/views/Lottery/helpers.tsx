import BigNumber from 'bignumber.js'
import { LotteryResponse, LotteryRound, LotteryRoundUserTickets } from 'state/types'

/**
 * Reverse the digits in a lottery number retrieved from the smart contract
 */
export const parseRetrievedNumber = (number: string): string[] => {
  let numberAsArray = number.split('')
  numberAsArray.reverse()
  const numBrackets = 6 // TODO: get this from lottery
  if (numberAsArray.length < numBrackets)
    numberAsArray = numberAsArray.concat(Array(numBrackets - numberAsArray.length).fill('0'))
  return numberAsArray
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
    ticketPrice: ticketPriceAsString,
    discountDivisor: discountDivisorAsString,
    amountCollected: amountCollectedAsString,
  } = lotteryData

  const discountDivisor = new BigNumber(discountDivisorAsString)
  const ticketPrice = new BigNumber(ticketPriceAsString)
  const amountCollected = new BigNumber(amountCollectedAsString)

  return {
    isLoading: lotteryData.isLoading,
    lotteryId: lotteryData.lotteryId,
    userTickets: lotteryData.userTickets,
    status: lotteryData.status,
    startTime: lotteryData.startTime,
    endTime: lotteryData.endTime,
    ticketPrice,
    discountDivisor,
    winnersPortion: lotteryData.winnersPortion,
    burnPortion: lotteryData.burnPortion,
    firstTicketId: lotteryData.firstTicketId,
    amountCollected,
    finalNumber: lotteryData.finalNumber,
    rewardPerUserPerBracket: lotteryData.rewardPerUserPerBracket,
    countWinnersPerBracket: lotteryData.countWinnersPerBracket,
    rewardPortions: lotteryData.rewardPortions,
  }
}
