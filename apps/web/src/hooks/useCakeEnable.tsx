import { useState, useCallback, useMemo } from 'react'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { Native } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { KLAY } from '@pancakeswap/tokens'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useTradeExactOut } from 'hooks/Trades'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

export const useCakeEnable = (enableAmount: BigNumber) => {
  const { chainId } = useAccountActiveChain()
  const [pendingEnableTx, setPendingEnableTx] = useState(false)
  const [, setTransactionHash] = useState<string>()
  const swapAmount = useMemo(() => getFullDisplayBalance(enableAmount), [enableAmount])

  const parsedAmount = tryParseAmount(swapAmount, KLAY[chainId])

  const trade = useTradeExactOut(Native.onChain(ChainId.BSC), parsedAmount)

  const swapCalls = useSwapCallArguments(trade, INITIAL_ALLOWED_SLIPPAGE, null)

  const { callback: swapCallback } = useSwapCallback(trade, INITIAL_ALLOWED_SLIPPAGE, null, swapCalls)

  const handleEnable = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setPendingEnableTx(true)
    swapCallback()
      .then((hash) => {
        setTransactionHash(hash)
      })
      .catch(() => {
        setPendingEnableTx(false)
      })
  }, [swapCallback])

  return { handleEnable, pendingEnableTx }
}
