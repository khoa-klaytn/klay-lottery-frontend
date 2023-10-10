export type MultiCallResponse<T> = T | null

// Farm Auction

// Note: slightly different from AuctionStatus used throughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus
  startBlock: bigint
  endBlock: bigint
  initialBidAmount: bigint
  leaderboard: bigint
  leaderboardThreshold: bigint
}

export interface BidsPerAuction {
  account: string
  amount: bigint
}
