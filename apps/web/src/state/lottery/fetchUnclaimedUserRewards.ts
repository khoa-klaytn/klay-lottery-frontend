import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryRoundGraphEntity } from 'state/types'
import SSLotteryABI from 'config/abi/SSLottery'
import { NUM_ROUNDS_TO_CHECK_FOR_REWARDS } from 'config/constants/lottery'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import { type Address, PublicClient } from 'viem'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'
import { MAX_LOTTERIES_REQUEST_SIZE } from './getLotteriesData'

interface RoundDataAndUserTickets {
  roundId: string
  userTickets: LotteryTicket[]
  finalNumber: string[]
}

const fetchRewardsForTickets = async (
  lotteryAddress: Address,
  client: PublicClient,
  tickets: LotteryTicket[],
): Promise<{ tickets: LotteryTicket[]; total: BigNumber }> => {
  try {
    const rewards = await Promise.all(
      tickets.map((ticket) =>
        client.readContract({
          abi: SSLotteryABI,
          address: lotteryAddress,
          functionName: 'viewRewardsForTicketId',
          args: [BigInt(ticket.roundId), BigInt(ticket.id)],
        }),
      ),
    )

    const total = rewards.reduce((accum: BigNumber, reward: bigint) => {
      return accum.plus(new BigNumber(reward.toString()))
    }, BIG_ZERO)

    return { tickets, total }
  } catch (error) {
    console.error(error)
    return { tickets: null, total: null }
  }
}

const getRewardBracketByNumber = (ticketNumber: string[], finalNumber: string[]): number => {
  const numBrackets = finalNumber.length
  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  let index = 0
  for (; index < numBrackets; ) {
    const ticketDigit = ticketNumber[index]
    const finalDigit = finalNumber[index]
    if (ticketDigit !== finalDigit) break
    ++index
  }
  return index
}

export const getWinningTickets = async (
  client: PublicClient,
  lotteryAddress: Address,
  roundDataAndUserTickets: RoundDataAndUserTickets,
): Promise<LotteryTicketClaimData> => {
  const { roundId, userTickets, finalNumber } = roundDataAndUserTickets

  const ticketsWithRewardBrackets = userTickets.map((ticket) => {
    return {
      roundId,
      id: ticket.id,
      number: ticket.number,
      status: ticket.status,
      rewardBracket: getRewardBracketByNumber(ticket.number, finalNumber),
    }
  })

  // A rewardBracket of -1 means no matches. 0 and above means there has been a match
  const allWinningTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return ticket.rewardBracket > 0
  })

  // If ticket.status is true, the ticket has already been claimed
  const unclaimedTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return !ticket.status
  })

  if (unclaimedTickets.length > 0) {
    const { tickets, total } = await fetchRewardsForTickets(lotteryAddress, client, unclaimedTickets)
    return { ticketsWithUnclaimedRewards: tickets, allWinningTickets, total, roundId }
  }

  if (allWinningTickets.length > 0) {
    return { ticketsWithUnclaimedRewards: null, allWinningTickets, total: null, roundId }
  }

  return null
}

const getWinningNumbersForRound = (targetRoundId: string, lotteriesData: LotteryRoundGraphEntity[]) => {
  const targetRound = lotteriesData.find((pastLottery) => pastLottery.id === targetRoundId)
  return targetRound?.finalNumber
}

const fetchUnclaimedUserRewards = async (
  lotteryAddress: Address,
  client: PublicClient,
  account: string,
  userLotteryData: LotteryUserGraphEntity,
  lotteriesData: LotteryRoundGraphEntity[],
  currentLotteryId: string,
): Promise<LotteryTicketClaimData[]> => {
  const { rounds } = userLotteryData

  // If there is no user round history - return an empty array
  if (rounds.length === 0) {
    return []
  }

  // If the web3 provider account doesn't equal the userLotteryData account, return an empty array - this is effectively a loading state as the user switches accounts
  if (userLotteryData.account.toLowerCase() !== account.toLowerCase()) {
    return []
  }

  // Filter out rounds without subgraph data (i.e. >100 rounds ago)
  const roundsInRange = rounds.filter((round) => {
    const lastCheckableRoundId = parseInt(currentLotteryId, 10) - MAX_LOTTERIES_REQUEST_SIZE
    const roundId = parseInt(round.lotteryId, 10)
    return roundId >= lastCheckableRoundId
  })

  // Filter out non-claimable rounds
  const claimableRounds = roundsInRange.filter((round) => {
    return round.status.toLowerCase() === LotteryStatus.CLAIMABLE
  })

  // Rounds with no tickets claimed OR rounds where a user has over 100 tickets, could have prizes
  const roundsWithPossibleWinnings = claimableRounds.filter((round) => {
    return !round.claimed || parseInt(round.totalTickets, 10) > 100
  })

  // Check the X  most recent rounds, where X is NUM_ROUNDS_TO_CHECK_FOR_REWARDS
  const roundsToCheck = roundsWithPossibleWinnings.slice(0, NUM_ROUNDS_TO_CHECK_FOR_REWARDS)

  if (roundsToCheck.length > 0) {
    const idsToCheck = roundsToCheck.map((round) => round.lotteryId)
    const userTicketData = await fetchUserTicketsForMultipleRounds(client, lotteryAddress, idsToCheck, account)
    const roundsWithTickets = userTicketData.filter((roundData) => roundData?.userTickets?.length > 0)

    const roundDataAndWinningTickets = roundsWithTickets.map((roundData) => {
      return { ...roundData, finalNumber: getWinningNumbersForRound(roundData.roundId, lotteriesData) }
    })

    const winningTicketsForPastRounds = await Promise.all(
      roundDataAndWinningTickets.map((roundData) => getWinningTickets(client, lotteryAddress, roundData)),
    )

    // Filter out null values (returned when no winning tickets found for past round)
    const roundsWithWinningTickets = winningTicketsForPastRounds.filter(
      (winningTicketData) => winningTicketData !== null,
    )

    // Filter to only rounds with unclaimed tickets
    const roundsWithUnclaimedWinningTickets = roundsWithWinningTickets.filter(
      (winningTicketData) => winningTicketData.ticketsWithUnclaimedRewards,
    )

    return roundsWithUnclaimedWinningTickets
  }
  // All rounds claimed, return empty array
  return []
}

export default fetchUnclaimedUserRewards
