import { klayLotteryABI } from 'config/abi/klayLottery'
import { useEffect, useMemo, useState } from 'react'
import { getKlayLotteryAddress } from 'utils/addressHelpers'
import { useAccount, usePublicClient } from 'wagmi'
import { Button } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import Modal from './Modal'

const klayLotteryAddress = getKlayLotteryAddress()

const ShowAdminBtn = styled(Button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`

export default function Admin() {
  const publicClient = usePublicClient()
  const { address: account } = useAccount()
  const [isOperator, setIsOperator] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isInjector, setIsInjector] = useState(false)
  const isAdmin = useMemo(() => isOperator || isOwner || isInjector, [isOperator, isOwner, isInjector])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (account && publicClient) {
      const operatorPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: klayLotteryAddress,
          functionName: 'operatorAddress',
        })
        .then((operatorAddress) => {
          console.info(`operatorAddress: ${operatorAddress}`)
          setIsOperator(operatorAddress === account)
          return operatorAddress
        })
      const ownerPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: klayLotteryAddress,
          functionName: 'owner',
        })
        .then((ownerAddress) => {
          console.info(`ownerAddress: ${ownerAddress}`)
          setIsOwner(ownerAddress === account)
          return ownerAddress
        })
      const injectorPromise = publicClient
        .readContract({
          abi: klayLotteryABI,
          address: klayLotteryAddress,
          functionName: 'injectorAddress',
        })
        .then((injectorAddress) => {
          console.info(`injectorAddress: ${injectorAddress}`)
          return injectorAddress
        })
      ;(async () => {
        const [, ownerAddress, injectorAddress] = await Promise.all([operatorPromise, ownerPromise, injectorPromise])
        setIsInjector(injectorAddress === account || ownerAddress === account)
      })()
    }
  }, [account, publicClient])

  if (!isAdmin) return <></>

  return (
    <>
      <ShowAdminBtn type="button" onClick={() => setShowModal(true)}>
        Admin
      </ShowAdminBtn>
      {showModal && (
        <Modal
          isOperator={isOperator}
          isOwner={isOwner}
          isInjector={isInjector}
          hideModal={() => setShowModal(false)}
        />
      )}
    </>
  )
}
