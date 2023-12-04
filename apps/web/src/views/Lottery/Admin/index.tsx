import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { Button, useToast } from '@sweepstakes/uikit'
import { styled } from 'styled-components'
import SSLotteryABI from 'config/abi/SSLottery'
import Modal from './Modal'
import useLotteryAddress from '../hooks/useLotteryAddress'

const ShowAdminBtn = styled(Button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`

function Enum<T extends ReadonlyArray<string>>(...arr: T): { [K in T[number]]: number } {
  return arr.reduce((acc, key, idx) => {
    // eslint-disable-next-line no-param-reassign
    acc[key] = idx
    return acc
  }, Object.create(null))
}
const RoleName = Enum('Owner', 'Operator', 'Injector', 'Querier')

export default function Admin() {
  const publicClient = usePublicClient()
  const ssLotteryAddress = useLotteryAddress()
  const { address: account } = useAccount()
  const [isOperator, setIsOperator] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isInjector, setIsInjector] = useState(false)
  const isAdmin = useMemo(() => isOperator || isOwner || isInjector, [isOperator, isOwner, isInjector])
  const [showModal, setShowModal] = useState(false)
  const { toastError } = useToast()

  useEffect(() => {
    if (account && publicClient) {
      ;(async () => {
        const hasRole = async (roleName: number): Promise<boolean | null> =>
          publicClient
            .readContract({
              abi: SSLotteryABI,
              address: ssLotteryAddress,
              functionName: 'hasRole',
              args: [roleName, account],
            })
            .catch(() => {
              throw Error(`Failed to read ${roleName} from contract`)
            })

        const isOwner_ = await hasRole(RoleName.Owner)
        setIsOwner(isOwner_)
        const isOperator_ = await hasRole(RoleName.Operator)
        setIsOperator(isOperator_)
        const isInjector_ = await hasRole(RoleName.Injector)
        setIsInjector(isInjector_)
      })().catch((e) => {
        console.error(e)
      })
    }
  }, [publicClient, account, toastError, ssLotteryAddress])

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
