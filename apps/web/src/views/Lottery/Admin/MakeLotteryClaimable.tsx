import * as chains from 'config/chains'
import { Button } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallback, useMemo } from 'react'
import { Chain, useChainId } from 'wagmi'
import { SendTransactionResult } from 'wagmi/dist/actions'

export function MakeLotteryClaimable({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chains.CHAIN_QUERY_NAME[chainId]] as Chain, [chainId])
  const makeLotteryClaimable = useCallback(async () => {
    let res: SendTransactionResult
    if (chain.testnet) {
      res = await callWithGasPrice(lotteryContract, 'setFinalNumberAndMakeLotteryClaimable', [
        BigInt(lotteryId),
        true,
        BigInt(1),
      ])
    } else {
      res = await callWithGasPrice(lotteryContract, 'drawFinalNumberAndMakeLotteryClaimable', [BigInt(lotteryId), true])
    }
    console.log(res)
  }, [chain, callWithGasPrice, lotteryContract, lotteryId])

  return (
    <Button type="button" onClick={makeLotteryClaimable} disabled={status === LotteryStatus.CLOSE}>
      Make Lottery Claimable
    </Button>
  )
}
