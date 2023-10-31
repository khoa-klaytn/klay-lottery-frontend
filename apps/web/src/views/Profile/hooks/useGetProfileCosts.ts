import { useTranslation } from '@sweepstakes/localization'
import { useToast } from '@sweepstakes/uikit'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'
import { getSweepStakesProfileAddress } from 'utils/addressHelpers'
import { usePublicClient } from 'wagmi'

const useGetProfileCosts = () => {
  const publicClient = usePublicClient()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberCakeToReactivate: 0n,
    numberCakeToRegister: 0n,
    numberCakeToUpdate: 0n,
  })
  const { toastError } = useToast()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const pancakeProfileAddress = getSweepStakesProfileAddress()

        const [numberCakeToReactivate, numberCakeToRegister, numberCakeToUpdate] = await publicClient.multicall({
          allowFailure: false,
          contracts: [
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToReactivate',
            },
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToRegister',
            },
            {
              address: pancakeProfileAddress,
              abi: pancakeProfileABI,
              functionName: 'numberCakeToUpdate',
            },
          ],
        })

        setCosts({
          numberCakeToReactivate,
          numberCakeToRegister,
          numberCakeToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve KLAY costs for profile'))
      }
    }

    fetchCosts()
  }, [publicClient, setCosts, toastError, t, chainId])

  return { costs, isLoading }
}

export default useGetProfileCosts
