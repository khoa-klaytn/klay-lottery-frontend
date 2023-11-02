import * as chains from 'config/chains'
import { LotteryStatus } from 'config/constants/types'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { Chain, useChainId } from 'wagmi'
import { SendTransactionResult } from 'wagmi/dist/actions'
import { parseRetrievedNumber } from 'views/Lottery/helpers'
import { BaseError } from 'viem'
import { handleCustomError } from 'utils/viem'
import { Button } from '@sweepstakes/uikit'
import { EMsg } from '../EMsg'

export default function MakeLotteryClaimable({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chains.CHAIN_QUERY_NAME[chainId]] as Chain, [chainId])
  const [finalNumber, setFinalNumber] = useState<number>(Number.NaN)
  const [eMsg, setEMsg] = useState('')

  const makeLotteryClaimable = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      let res: SendTransactionResult
      try {
        if (chain.testnet && !Number.isNaN(finalNumber)) {
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
        setEMsg('')
        console.log(res)
      } catch (e) {
        console.error(e)
        if (e instanceof BaseError) {
          handleCustomError(e, {
            LotteryNotClose: (_, msg) => setEMsg(msg),
            FinalNumberNotDrawn: (_, msg) => setEMsg(msg),
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
      <Button type="submit" disabled={status !== LotteryStatus.CLOSE}>
        Make Lottery Claimable
      </Button>
      {eMsg && <EMsg>{eMsg}</EMsg>}
    </form>
  )
}
