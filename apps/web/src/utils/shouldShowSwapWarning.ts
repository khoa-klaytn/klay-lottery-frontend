import { Token } from '@sweepstakes/sdk'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const shouldShowSwapWarning = (chainId: number, swapCurrency: Token): boolean => {
  if (SwapWarningTokens[chainId]) {
    const swapWarningTokens = Object.values(SwapWarningTokens[chainId])
    return swapWarningTokens.some((warningToken) => warningToken.equals(swapCurrency))
  }

  return false
}

export default shouldShowSwapWarning
