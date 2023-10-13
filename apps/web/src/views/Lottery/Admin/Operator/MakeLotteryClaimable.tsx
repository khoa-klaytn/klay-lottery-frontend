import * as chains from 'config/chains'
import { LotteryStatus } from 'config/constants/types'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Chain, useChainId } from 'wagmi'
import { SendTransactionResult } from 'wagmi/dist/actions'
import { parseRetrievedNumber } from 'views/Lottery/helpers'
import { BaseError } from 'viem'
import { handleCustomError } from 'utils/viem'
import { setRefCustomValidity } from 'utils/customValidity'

export default function MakeLotteryClaimable({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chains.CHAIN_QUERY_NAME[chainId]] as Chain, [chainId])
  const [finalNumber, setFinalNumber] = useState(0)
  const btnRef = useRef<HTMLInputElement>(null)
  setRefCustomValidity(btnRef, 'Lottery is not close')

  const makeLotteryClaimable = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      let res: SendTransactionResult
      try {
        if (chain.testnet) {
          res = await callWithGasPrice(lotteryContract, 'setFinalNumberAndMakeLotteryClaimable', [
            BigInt(lotteryId),
            true,
            BigInt(parseRetrievedNumber(finalNumber.toString()).join('')),
          ])
        } else {
          res = await callWithGasPrice(lotteryContract, 'drawFinalNumberAndMakeLotteryClaimable', [
            BigInt(lotteryId),
            true,
          ])
        }
        console.log(res)
      } catch (e) {
        console.error(e)
        if (e instanceof BaseError) {
          handleCustomError(e, {
            LotteryNotClose: (_, msg) => setRefCustomValidity(btnRef, msg),
            FinalNumberNotDrawn: (_, msg) => setRefCustomValidity(btnRef, msg),
          })
        }
      }
    },
    [chain, callWithGasPrice, lotteryContract, lotteryId, finalNumber],
  )

  return (
    <form onSubmit={makeLotteryClaimable}>
      {chain.testnet && (
        <input type="number" value={finalNumber} onChange={(ev) => setFinalNumber(ev.target.valueAsNumber)} />
      )}
      <input type="submit" ref={btnRef} disabled={status !== LotteryStatus.CLOSE} value="Make Lottery Claimable" />
    </form>
  )
}
