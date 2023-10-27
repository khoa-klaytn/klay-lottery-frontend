import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryRoundGraphEntity } from 'state/types'
import { klayLotteryABI } from 'config/abi/klayLottery'
import { NUM_ROUNDS_TO_CHECK_FOR_REWARDS } from 'config/constants/lottery'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { type Address, PublicClient } from 'viem'
import { parseRetrievedNumber } from 'views/Lottery/helpers'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'
import { MAX_LOTTERIES_REQUEST_SIZE } from './getLotteriesData'

interface RoundDataAndUserTickets {
  roundId: string
  userTickets: LotteryTicket[]
  finalNumber: string
}

const fetchCakeRewardsForTickets = async (
  lotteryAddress: Address,
  client: PublicClient,
  winningTickets: LotteryTicket[],
): Promise<{ ticketsWithUnclaimedRewards: LotteryTicket[]; total: BigNumber }> => {
  try {
    const rewards = await Promise.all(
      winningTickets.map((ticket) =>
        client.readContract({
          abi: klayLotteryABI,
          address: lotteryAddress,
          functionName: 'viewRewardsForTicketId',
          args: [BigInt(ticket.roundId), BigInt(ticket.id)],
        }),
      ),
    )

    const total = rewards.reduce((accum: BigNumber, reward: bigint) => {
      return accum.plus(new BigNumber(reward.toString()))
    }, BIG_ZERO)

    const ticketsWithUnclaimedRewards = winningTickets.map((winningTicket, index) => {
      return { ...winningTicket, cakeReward: rewards[index].toString() }
    })
    return { ticketsWithUnclaimedRewards, total }
  } catch (error) {
    console.error(error)
    return { ticketsWithUnclaimedRewards: null, total: null }
  }
}

const getRewardBracketByNumber = (ticketNumber: string, finalNumber: string): number => {
  // Winning numbers are evaluated right-to-left in the smart contract, so we reverse their order for validation here:
  // i.e. '1123456' should be evaluated as '6543211'
  const parsedTicketNum = parseRetrievedNumber(ticketNumber)
  const parsedFinalNum = parseRetrievedNumber(finalNumber)

  const numBrackets = parsedFinalNum.length
  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  for (let index = 0; index < numBrackets; index++) {
    if (parsedTicketNum[index] === parsedFinalNum[index]) {
      const rewardBracket = numBrackets - index
      return rewardBracket
    }
  }
  return 0
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
    return ticket.rewardBracket >= 0
  })

  // If ticket.status is true, the ticket has already been claimed
  const unclaimedWinningTickets = allWinningTickets.filter((ticket) => {
    return !ticket.status
  })

  if (unclaimedWinningTickets.length > 0) {
    const { ticketsWithUnclaimedRewards, total } = await fetchCakeRewardsForTickets(
      lotteryAddress,
      client,
      unclaimedWinningTickets,
    )
    return { ticketsWithUnclaimedRewards, allWinningTickets, total, roundId }
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
