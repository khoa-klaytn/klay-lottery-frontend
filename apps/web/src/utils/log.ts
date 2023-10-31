import { Currency } from '@sweepstakes/swap-sdk-core'
import { log } from 'next-axiom'
import type { Address } from 'viem'

export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}

export const logSwap = ({
  input,
  output,
  inputAmount,
  outputAmount,
  chainId,
  account,
  hash,
  type,
}: {
  input: Currency
  output: Currency
  inputAmount: string
  outputAmount: string
  chainId: number
  account: Address
  hash: Address
  type: 'V2Swap' | 'SmartSwap' | 'StableSwap' | 'MarketMakerSwap' | 'V3SmartSwap'
}) => {
  try {
    log.info(type, {
      inputAddress: input.isToken ? input.address.toLowerCase() : input.symbol,
      outputAddress: output.isToken ? output.address.toLowerCase() : output.symbol,
      inputAmount,
      outputAmount,
      account,
      hash,
      chainId,
    })
  } catch (error) {
    //
  }
}
