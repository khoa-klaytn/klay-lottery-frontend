import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { AppState, useAppDispatch } from 'state'
import pickBy from 'lodash/pickBy'
import mapValues from 'lodash/mapValues'
import keyBy from 'lodash/keyBy'
import orderBy from 'lodash/orderBy'
import omitBy from 'lodash/omitBy'
import isEmpty from 'lodash/isEmpty'
import { useAccount } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { FeeAmount } from '@sweepstakes/v3-sdk'
import { Hash } from 'viem'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { TransactionDetails } from './reducer'
import {
  addTransaction,
  TransactionType,
  NonBscFarmTransactionType,
  FarmTransactionStatus,
  NonBscFarmStepType,
} from './actions'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: { hash: Hash | string } | { transactionHash: Hash | string },
  customData?: {
    summary?: string
    translatableSummary?: { text: string; data?: Record<string, string | number> }
    claim?: { recipient: string }
    type?: TransactionType
    order?: Order
    nonBscFarm?: NonBscFarmTransactionType
    // add/remove pool
    baseCurrencyId?: string
    quoteCurrencyId?: string
    expectedAmountBaseRaw?: string
    expectedAmountQuoteRaw?: string
    feeAmount?: FeeAmount
    createPool?: boolean
    // fee collect
    currencyId0?: string
    currencyId1?: string
    expectedCurrencyOwed0?: string
    expectedCurrencyOwed1?: string
  },
) => void {
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  return useCallback(
    (
      response,
      {
        summary,
        translatableSummary,
        claim,
        type,
        order,
        nonBscFarm,
      }: {
        summary?: string
        translatableSummary?: { text: string; data?: Record<string, string | number> }
        claim?: { recipient: string }
        type?: TransactionType
        order?: Order
        nonBscFarm?: NonBscFarmTransactionType
      } = {},
    ) => {
      if (!account) return
      if (!chainId) return

      let hash: Hash | string

      if ('hash' in response) {
        // eslint-disable-next-line prefer-destructuring
        hash = response.hash
      } else if ('transactionHash' in response) {
        hash = response.transactionHash
      }

      if (!hash) {
        throw Error('No transaction hash found.')
      }
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          summary,
          translatableSummary,
          claim,
          type,
          order,
          nonBscFarm,
        }),
      )
    },
    [dispatch, chainId, account],
  )
}

// returns all the transactions
export function useAllTransactions(): { [chainId: number]: { [txHash: string]: TransactionDetails } } {
  const { address: account } = useAccount()

  const state: {
    [chainId: number]: {
      [txHash: string]: TransactionDetails
    }
  } = useSelector<AppState, AppState['transactions']>((s) => s.transactions)

  return useMemo(() => {
    return mapValues(state, (transactions) =>
      pickBy(transactions, (transactionDetails) => transactionDetails.from.toLowerCase() === account?.toLowerCase()),
    )
  }, [account, state])
}

export function useAllSortedRecentTransactions(): { [chainId: number]: { [txHash: string]: TransactionDetails } } {
  const allTransactions = useAllTransactions()
  return useMemo(() => {
    return omitBy(
      mapValues(allTransactions, (transactions) =>
        keyBy(
          orderBy(
            pickBy(transactions, (trxDetails) => isTransactionRecent(trxDetails)),
            ['addedTime'],
            'desc',
          ),
          'hash',
        ),
      ),
      isEmpty,
    )
  }, [allTransactions])
}

// returns all the transactions for the current chain
export function useAllActiveChainTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveChainId()

  return useAllChainTransactions(chainId)
}

export function useAllChainTransactions(chainId: number): { [txHash: string]: TransactionDetails } {
  const { address: account } = useAccount()

  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)

  return useMemo(() => {
    if (chainId && state[chainId]) {
      return pickBy(
        state[chainId],
        (transactionDetails) => transactionDetails.from.toLowerCase() === account?.toLowerCase(),
      )
    }
    return {}
  }, [account, chainId, state])
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllActiveChainTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return Date.now() - tx.addedTime < 86_400_000
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// calculate pending transactions
interface NonBscPendingData {
  txid: string
  lpAddress: string
  type: NonBscFarmStepType
}
export function usePendingTransactions(): {
  hasPendingTransactions: boolean
  pendingNumber: number
  nonBscFarmPendingList: NonBscPendingData[]
} {
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions).flatMap((trxObjects) => Object.values(trxObjects))
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt || tx?.nonBscFarm?.status === FarmTransactionStatus.PENDING)
    .map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  const nonBscFarmPendingList = sortedRecentTransactions
    .filter((tx) => pending.includes(tx.hash) && !!tx.nonBscFarm)
    .map((tx) => ({ txid: tx?.hash, lpAddress: tx?.nonBscFarm?.lpAddress, type: tx?.nonBscFarm?.type }))

  return {
    hasPendingTransactions,
    nonBscFarmPendingList,
    pendingNumber: pending.length,
  }
}

export function useNonBscFarmPendingTransaction(lpAddress: string): NonBscPendingData[] {
  const { nonBscFarmPendingList } = usePendingTransactions()
  return useMemo(() => {
    return nonBscFarmPendingList.filter((tx) => tx.lpAddress.toLocaleLowerCase() === lpAddress.toLocaleLowerCase())
  }, [lpAddress, nonBscFarmPendingList])
}
