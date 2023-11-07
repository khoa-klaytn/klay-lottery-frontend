import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { Button, useToast } from '@sweepstakes/uikit'
import { styled } from 'styled-components'
import { accessControlABI } from 'config/abi/accessControl'
import useAccessControlAddress from 'hooks/useAccessControl'
import Modal from './Modal'

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
const RoleName = Enum('Operator', 'Injector', 'Querier')

export default function Admin() {
  const publicClient = usePublicClient()
  const accessControlAddress = useAccessControlAddress()
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
        const isOwner_ = await publicClient.readContract({
          abi: accessControlABI,
          address: accessControlAddress,
          functionName: 'isOwnerMember',
          args: [account],
        })
        setIsOwner(isOwner_)

        const hasRole = async (roleName: number): Promise<boolean | null> =>
          publicClient
            .readContract({
              abi: accessControlABI,
              address: accessControlAddress,
              functionName: 'hasRole',
              args: [roleName, account],
            })
            .catch(() => {
              throw Error(`Failed to read ${roleName} from contract`)
            })

        const isOperator_ = await hasRole(RoleName.Operator)
        setIsOperator(isOperator_)
        const isInjector_ = await hasRole(RoleName.Injector)
        setIsInjector(isOwner_ || isInjector_)
      })().catch((e) => {
        console.error(e)
        toastError('Failed to read admin roles from contract')
      })
    }
  }, [publicClient, account, toastError, accessControlAddress])

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
