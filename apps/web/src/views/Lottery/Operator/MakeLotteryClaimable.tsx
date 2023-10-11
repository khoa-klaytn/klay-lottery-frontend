import * as chains from 'config/chains'
import { Button } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { Chain, useChainId } from 'wagmi'
import { SendTransactionResult } from 'wagmi/dist/actions'

export default function MakeLotteryClaimable({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chains.CHAIN_QUERY_NAME[chainId]] as Chain, [chainId])
  const [finalNumber, setFinalNumber] = useState(0)
  const makeLotteryClaimable = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      let res: SendTransactionResult
      if (chain.testnet) {
        res = await callWithGasPrice(lotteryContract, 'setFinalNumberAndMakeLotteryClaimable', [
          BigInt(lotteryId),
          true,
          BigInt(finalNumber),
        ])
      } else {
        res = await callWithGasPrice(lotteryContract, 'drawFinalNumberAndMakeLotteryClaimable', [
          BigInt(lotteryId),
          true,
        ])
      }
      console.log(res)
    },
    [chain, callWithGasPrice, lotteryContract, lotteryId, finalNumber],
  )

  return (
    <form onSubmit={makeLotteryClaimable}>
      {chain.testnet && (
        <input type="number" value={finalNumber} onChange={(ev) => setFinalNumber(ev.target.valueAsNumber)} />
      )}
      <Button type="submit" disabled={status !== LotteryStatus.CLOSE}>
        Make Lottery Claimable
      </Button>
    </form>
  )
}
