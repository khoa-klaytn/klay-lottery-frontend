import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { Address, erc20ABI } from 'wagmi'
import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { FAST_INTERVAL } from 'config/constants'

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined
  refetch: () => Promise<any>
} {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(() => [owner, spender] as [Address, Address], [owner, spender])

  const { data: allowance, refetch } = useQuery(
    [chainId, token?.address, owner, spender],
    () =>
      publicClient({ chainId }).readContract({
        abi: erc20ABI,
        address: token?.address,
        functionName: 'allowance',
        args: inputs,
      }),
    {
      refetchInterval: FAST_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(spender && owner),
    },
  )

  return useMemo(
    () => ({
      allowance:
        token && typeof allowance !== 'undefined'
          ? CurrencyAmount.fromRawAmount(token, allowance.toString())
          : undefined,
      refetch,
    }),
    [token, refetch, allowance],
  )
}

export default useTokenAllowance
