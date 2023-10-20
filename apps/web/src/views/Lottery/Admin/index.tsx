import { klayLotteryABI } from 'config/abi/klayLottery'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { Button } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import Modal from './Modal'
import useLotteryAddress from '../hooks/useLotteryAddress'

const ShowAdminBtn = styled(Button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`

export default function Admin() {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const { address: account } = useAccount()
  const [isOperator, setIsOperator] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isInjector, setIsInjector] = useState(false)
  const isAdmin = useMemo(() => isOperator || isOwner || isInjector, [isOperator, isOwner, isInjector])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (account && publicClient) {
      ;(async () => {
        const operatorAddress = await publicClient.readContract({
          abi: klayLotteryABI,
          address: lotteryAddress,
          functionName: 'operatorAddress',
        })
        console.info(`operatorAddress: ${operatorAddress}`)
        setIsOperator(operatorAddress === account)

        const ownerAddress = await publicClient.readContract({
          abi: klayLotteryABI,
          address: lotteryAddress,
          functionName: 'owner',
        })
        console.info(`ownerAddress: ${ownerAddress}`)
        setIsOwner(ownerAddress === account)

        const injectorAddress = await publicClient.readContract({
          abi: klayLotteryABI,
          address: lotteryAddress,
          functionName: 'injectorAddress',
        })
        console.info(`injectorAddress: ${injectorAddress}`)
        setIsInjector([operatorAddress, ownerAddress].includes(injectorAddress))
      })()
    }
  }, [publicClient, lotteryAddress, account])

  return isAdmin ? (
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
  ) : null
}
