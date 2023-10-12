import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { klayLotteryABI } from 'config/abi/klayLottery'
import { getKlayLotteryAddress } from 'utils/addressHelpers'
import InjectFunds from './InjectFunds'
import Operator from './Operator'
import Owner from './Owner'

export default function Admin() {
  const publicClient = usePublicClient()
  const { address: account } = useAccount()
  const [isOperator, setIsOperator] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isInjector, setIsInjector] = useState(false)

  useEffect(() => {
    if (account && publicClient) {
      const operatorPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: getKlayLotteryAddress(),
          functionName: 'operatorAddress',
        })
        .then((operatorAddress) => {
          if (operatorAddress === account) setIsOperator(true)
        })
      const ownerPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: getKlayLotteryAddress(),
          functionName: 'owner',
        })
        .then((ownerAddress) => {
          if (ownerAddress === account) {
            setIsOwner(true)
            setIsInjector(true)
          }
        })
      const injectorPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: getKlayLotteryAddress(),
          functionName: 'injectorAddress',
        })
        .then((injectorAddress) => {
          if (injectorAddress === account) setIsInjector(true)
        })
      Promise.all([operatorPromise, ownerPromise, injectorPromise])
    }
  }, [account, publicClient])

  return (
    <>
      {isOperator && <Operator />}
      {isOwner && <Owner />}
      {isInjector && <InjectFunds />}
    </>
  )
}
