import { useAccount, usePublicClient } from 'wagmi'
import BigNumber from 'bignumber.js'
import useSWR from 'swr'
import { ChainId } from '@sweepstakes/chains'
import { useTranslation } from '@sweepstakes/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition } from 'utils/cakePool'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { cakeVaultV2ABI } from '@sweepstakes/pools'

const useCakeBenefits = () => {
  const publicClient = usePublicClient()
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const cakeVaultAddress = getCakeVaultAddress()
  const currentBscBlock = useChainCurrentBlock(ChainId.BSC)

  const { data, status } = useSWR(account && currentBscBlock && ['cakeBenefits', account], async () => {
    const [userInfo] = await publicClient.multicall({
      contracts: [
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'userInfo',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'calculatePerformanceFee',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'calculateOverdueFee',
          args: [account],
        },
        {
          address: cakeVaultAddress,
          abi: cakeVaultV2ABI,
          functionName: 'getPricePerFullShare',
        },
      ],
      allowFailure: false,
    })

    const userContractResponse = {
      shares: userInfo[0],
      lastDepositedTime: userInfo[1],
      cakeAtLastUserAction: userInfo[2],
      lastUserActionTime: userInfo[3],
      lockStartTime: userInfo[4],
      lockEndTime: userInfo[5],
      userBoostedShare: userInfo[6],
      locked: userInfo[7],
      lockedAmount: userInfo[8],
    }

    const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
    const lockPosition = getVaultPosition({
      userShares: userSharesAsBignumber,
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
    })

    return {
      lockPosition,
      lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }),
    }
  })

  return { data, status }
}

export default useCakeBenefits
