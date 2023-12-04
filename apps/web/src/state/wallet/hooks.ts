import { CurrencyAmount, Token } from '@sweepstakes/sdk'
import { useMemo } from 'react'
import { isAddress } from 'utils'
import type { Address } from 'viem'
import { erc20ABI } from 'wagmi'
import { useMultipleContractSingleData } from '../multicall/hooks'

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens],
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData({
    abi: erc20ABI,
    addresses: validatedTokenAddresses,
    functionName: 'balanceOf',
    args: useMemo(() => [address as Address] as const, [address]),
    options: {
      enabled: Boolean(address && validatedTokenAddresses.length > 0),
    },
  })

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result
              const amount = typeof value !== 'undefined' ? BigInt(value.toString()) : undefined
              if (typeof amount !== 'undefined') {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances],
    ),
    anyLoading,
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token]),
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}
