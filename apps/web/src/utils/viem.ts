import { ChainId } from '@sweepstakes/chains'
import SSLotteryABI from 'config/abi/SSLottery'
import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import {
  createPublicClient,
  http,
  fallback,
  PublicClient,
  ContractFunctionRevertedError,
  BaseError,
  AbiItem,
} from 'viem'

export const viemClients = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: fallback(
        (PUBLIC_NODES[cur.id] as string[]).map((url) =>
          http(url, {
            timeout: 15_000,
          }),
        ),
        {
          rank: false,
        },
      ),
      batch: {
        multicall: {
          batchSize: cur.id === ChainId.POLYGON_ZKEVM ? 128 : 1024 * 200,
          wait: 16,
        },
      },
      pollingInterval: 6_000,
    }),
  }
}, {} as Record<ChainId, PublicClient>)

export const getViemClients = ({ chainId }: { chainId?: ChainId }) => {
  return viemClients[chainId]
}

type AbiError = Extract<AbiItem, { type: 'error' }>

type SSLotteryError = Extract<(typeof SSLotteryABI)[number], AbiError>
type SSLotteryErrorName = SSLotteryError['name']
type AbiItemInput2Param<T extends AbiError['inputs'][number]> = T extends { type: 'uint256' } ? bigint : string
type AbiItemInputs2Params<T extends AbiError['inputs']> = {
  [K in keyof T]: AbiItemInput2Param<T[K]>
}
type SSLotteryErrorHandlerRecord = {
  [K in SSLotteryErrorName]?: (
    inputs: AbiItemInputs2Params<Extract<SSLotteryError, { name: K }>['inputs']>,
    msg: string,
  ) => void
}

export function handleCustomError(e: unknown, handlers: SSLotteryErrorHandlerRecord = {}) {
  console.error(e)
  if (!(e instanceof BaseError)) throw e

  const revertError = e.walk((walkE) => walkE instanceof ContractFunctionRevertedError)
  if (!(revertError instanceof ContractFunctionRevertedError)) throw e

  const { data } = revertError
  console.error('Revert Error Data:', data)
  if (!data) return

  const { args, errorName: name } = data
  let msg = name
  if (args && args.length) {
    const { inputs } = data.abiItem
    msg += ` [${inputs[0].name}: ${args[0]}`
    for (let i = 1; i < args.length; i++) {
      msg += `, ${inputs[i].name}: ${args[i]}`
    }
    msg += ']'
  }
  if (name in handlers) handlers[name](args, msg)
  else throw Error(msg)
}
