import { klayLotteryABI } from 'config/abi/klayLottery'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { Button, useToast } from '@sweepstakes/uikit'
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
  const { toastError } = useToast()

  const readRole = useCallback(
    async (roleName: 'operatorAddress' | 'owner' | 'injectorAddress'): Promise<string | null> =>
      publicClient
        .readContract({
          abi: klayLotteryABI,
          address: lotteryAddress,
          functionName: roleName,
        })
        .catch(() => {
          throw Error(`Failed to read ${roleName} from contract`)
        }),
    [lotteryAddress, publicClient],
  )

  useEffect(() => {
    if (account && publicClient) {
      ;(async () => {
        const operatorAddress = await readRole('operatorAddress')
        setIsOperator(operatorAddress === account)
        const ownerAddress = await readRole('owner')
        setIsOwner(ownerAddress === account)
        const injectorAddress = await readRole('injectorAddress')
        setIsInjector([injectorAddress, ownerAddress].includes(account))
      })().catch((e) => {
        console.error(e)
        toastError('Failed to read admin roles from contract')
      })
    }
  }, [publicClient, lotteryAddress, account, readRole, toastError])

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
