import { ChainId } from '@sweepstakes/chains'

export const verifyBscNetwork = (chainId: number) => {
  return chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET
}
