import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/chains'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs56 from 'config/constants/lpAprs/56.json'
import lpAprs1 from 'config/constants/lpAprs/1.json'

const getLpApr = (chainId: number) => {
  switch (chainId) {
    case ChainId.BSC:
      return lpAprs56
    case ChainId.ETHEREUM:
      return lpAprs1
    default:
      return {}
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number | null,
  rewardTokenPrice: number | null,
  totalStaked: number | null,
  tokenPerBlock: number | null,
): number | null => {
  if (stakingTokenPrice === null || rewardTokenPrice === null || totalStaked === null || tokenPerBlock === null) {
    return null
  }

  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export default null
