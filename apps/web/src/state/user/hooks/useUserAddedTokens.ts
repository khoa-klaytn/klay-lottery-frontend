import { useMemo } from 'react'
import { Token } from '@sweepstakes/sdk'
import { createSelector } from '@reduxjs/toolkit'
import { deserializeToken } from '@sweepstakes/token-lists'
import { useSelector } from 'react-redux'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { AppState } from '../../index'

const selectUserTokens = ({ user: { tokens } }: AppState) => tokens

export const userAddedTokenSelector = (chainId: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken),
  )
export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => userAddedTokenSelector(chainId), [chainId]))
}
