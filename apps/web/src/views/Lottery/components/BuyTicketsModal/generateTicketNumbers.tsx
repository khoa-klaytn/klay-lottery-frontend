import { LotteryTicket } from 'config/constants/types'
import lodashRandom from 'lodash/random'
import { parseRetrievedNumber } from 'views/Lottery/helpers'

const random = (max: number) => {
  return parseRetrievedNumber(lodashRandom(0, max).toString()).join('')
}

/**
 * Generate a specific number of unique, randomised 7-digit lottery numbers between 1000000 & 1999999
 */
const generateTicketNumbers = (
  numberOfTickets: number,
  userCurrentTickets?: LotteryTicket[] | null,
  numBrackets = 6,
): string[][] => {
  // Populate array with existing tickets (if they have them) to ensure no duplicates when generating new numbers
  const existingTicketNumbers =
    userCurrentTickets?.length > 0
      ? userCurrentTickets.map((ticket) => {
          return ticket?.number.join('')
        })
      : []
  const generatedTicketNumbers = [...existingTicketNumbers]

  const max = 10 ** numBrackets - 1
  for (let count = 0; count < numberOfTickets; count++) {
    let randomNumber = random(max)
    while (generatedTicketNumbers.includes(randomNumber)) {
      // Catch for duplicates - generate a new number until the array doesn't include the random number generated
      randomNumber = random(max)
    }
    generatedTicketNumbers.push(randomNumber)
  }

  // Filter out the users' existing tickets
  const ticketsToBuy: string[][] = []
  for (const ticketNumber of generatedTicketNumbers) {
    if (!existingTicketNumbers.includes(ticketNumber)) {
      ticketsToBuy.push(ticketNumber.split(''))
    }
  }

  return ticketsToBuy
}

export default generateTicketNumbers
