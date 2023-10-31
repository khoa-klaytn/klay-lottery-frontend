import { bscTokens } from '@sweepstakes/tokens'
import { ERC20Token } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'

export const WALLCHAIN_ENABLED = true

export const WallchainKeys = {
  bsc: process.env.NEXT_PUBLIC_WALLCHAIN_BSC_KEY,
}

export const WallchainPairs = [
  new ERC20Token(ChainId.BSC, '0xC9882dEF23bc42D53895b8361D0b1EDC7570Bc6A', 18, 'FIST'),
  bscTokens.wbnb,
]
