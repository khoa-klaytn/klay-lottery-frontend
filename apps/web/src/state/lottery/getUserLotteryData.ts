import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryTicket } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryResponse, UserRound } from 'state/types'
import { type Address, PublicClient } from 'viem'
import { getRoundIdsArray, fetchMultipleLotteries, calculateRoundClaimedAndClaimedTickets } from './helpers'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'

export const MAX_USER_LOTTERIES_REQUEST_SIZE = 100

/* eslint-disable camelcase */
type UserLotteriesWhere = { lottery_in?: string[] }

const applyNodeDataToUserGraphResponse = (
  userNodeData: { roundId: string; userTickets: LotteryTicket[] }[],
  userGraphData: UserRound[],
  lotteryNodeData: LotteryResponse[],
): UserRound[] => {
  //   If no graph rounds response - return node data
  if (userGraphData.length === 0) {
    return lotteryNodeData.map((nodeRound) => {
      const ticketDataForRound = userNodeData.find((roundTickets) => roundTickets.roundId === nodeRound.lotteryId)

      return {
        endTime: nodeRound.endTime,
        status: nodeRound.status,
        lotteryId: nodeRound.lotteryId.toString(),
        ...calculateRoundClaimedAndClaimedTickets(ticketDataForRound.userTickets),
        totalTickets: `${ticketDataForRound.userTickets.length.toString()}`,
        tickets: ticketDataForRound.userTickets,
      }
    })
  }

  // Return the rounds with combined node + subgraph data, plus all remaining subgraph rounds.
  const nodeRoundsWithGraphData = userNodeData.map((userNodeRound) => {
    const userGraphRound = userGraphData.find(
      (graphResponseRound) => graphResponseRound.lotteryId === userNodeRound.roundId,
    )
    const nodeRoundData = lotteryNodeData.find((nodeRound) => nodeRound.lotteryId === userNodeRound.roundId)
    let claimed: boolean
    let claimedTickets: string
    let totalTickets: string
    if (userGraphRound) {
      claimed = userGraphRound.claimed
      claimedTickets = userGraphRound.claimedTickets
      totalTickets = userGraphRound.totalTickets
    } else {
      const claimedAndClaimedTickets = calculateRoundClaimedAndClaimedTickets(userNodeRound.userTickets)
      claimed = claimedAndClaimedTickets.claimed
      claimedTickets = claimedAndClaimedTickets.claimedTickets
      totalTickets = userNodeRound.userTickets.length.toString()
    }
    return {
      endTime: nodeRoundData.endTime,
      status: nodeRoundData.status,
      lotteryId: nodeRoundData.lotteryId.toString(),
      claimed,
      claimedTickets,
      totalTickets,
      tickets: userNodeRound.userTickets,
    }
  })

  // Return the rounds with combined data, plus all remaining subgraph rounds.
  const [lastCombinedDataRound] = nodeRoundsWithGraphData.slice(-1)
  const lastCombinedDataRoundIndex = userGraphData
    .map((graphRound) => graphRound?.lotteryId)
    .indexOf(lastCombinedDataRound?.lotteryId)
  const remainingSubgraphRounds = userGraphData ? userGraphData.splice(lastCombinedDataRoundIndex + 1) : []
  const mergedResponse = [...nodeRoundsWithGraphData, ...remainingSubgraphRounds]
  return mergedResponse
}

export const getGraphLotteryUser = async (
  account: string,
  first = MAX_USER_LOTTERIES_REQUEST_SIZE,
  skip = 0,
  where: UserLotteriesWhere = {},
): Promise<LotteryUserGraphEntity> => {
  let user
  const blankUser = {
    account,
    totalTickets: '',
    rounds: [],
  }

  try {
    const response = await request(
      GRAPH_API_LOTTERY,
      gql`
        query getUserLotteries($account: ID!, $first: Int!, $skip: Int!, $where: Round_filter) {
          user(id: $account) {
            id
            totalTickets
            rounds(first: $first, skip: $skip, where: $where, orderDirection: desc, orderBy: block) {
              id
              lottery {
                id
                endTime
                status
              }
              claimedTickets
              totalTickets
            }
          }
        }
      `,
      { account: account.toLowerCase(), first, skip, where },
    )
    const userRes = response.user

    // If no user returned - return blank user
    if (!userRes) {
      user = blankUser
    } else {
      user = {
        account: userRes.id,
        totalTickets: userRes.totalTickets,
        rounds: userRes.rounds.map((round) => {
          const claimedTickets = round?.claimedTickets
          const totalTickets = round?.totalTickets
          return {
            lotteryId: round?.lottery?.id,
            endTime: round?.lottery?.endTime,
            claimedTickets,
            totalTickets,
            claimed: claimedTickets === totalTickets,
            status: round?.lottery?.status.toLowerCase(),
          }
        }),
      }
    }
  } catch (error) {
    console.error(error)
    user = blankUser
  }

  return user
}

const getUserLotteryData = async (
  client: PublicClient,
  lotteryAddress: Address,
  account: string,
  currentLotteryId: string,
): Promise<LotteryUserGraphEntity> => {
  const idsForTicketsNodeCall = getRoundIdsArray(currentLotteryId)
  const roundDataAndUserTickets = await fetchUserTicketsForMultipleRounds(
    client,
    lotteryAddress,
    idsForTicketsNodeCall,
    account,
  )
  const userRoundsNodeData = roundDataAndUserTickets.filter((round) => round.userTickets.length > 0)
  const idsForLotteriesNodeCall = userRoundsNodeData.map((round) => round.roundId)
  const [lotteriesNodeData, graphResponse] = await Promise.all([
    fetchMultipleLotteries(client, lotteryAddress, idsForLotteriesNodeCall),
    getGraphLotteryUser(account),
  ])
  const mergedRoundData = applyNodeDataToUserGraphResponse(userRoundsNodeData, graphResponse.rounds, lotteriesNodeData)
  const graphResponseWithNodeRounds = { ...graphResponse, rounds: mergedRoundData }
  return graphResponseWithNodeRounds
}

export default getUserLotteryData
