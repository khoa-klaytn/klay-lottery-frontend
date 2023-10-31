import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getSweepStakesSquadContract } from 'utils/contractHelpers'
import { nftSaleABI } from 'config/abi/nftSale'
import { usePublicClient } from 'wagmi'

const useUserInfos = ({ account, refreshCounter, setCallback }) => {
  const publicClient = usePublicClient()
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()
        const pancakeSquadContract = getSweepStakesSquadContract()

        if (account) {
          const calls = (
            ['canClaimForGen0', 'numberTicketsForGen0', 'numberTicketsUsedForGen0', 'viewNumberTicketsOfUser'] as const
          ).map(
            (method) =>
              ({
                abi: nftSaleABI,
                address: nftSaleAddress,
                functionName: method,
                args: [account] as const,
              } as const),
          )

          const [
            currentCanClaimForGen0,
            currentNumberTicketsForGen0,
            currentNumberTicketsUsedForGen0,
            currentNumberTicketsOfUser,
          ] = await publicClient.multicall({
            contracts: calls,
            allowFailure: false,
          })

          const currentTicketsOfUser = await publicClient.readContract({
            abi: nftSaleABI,
            address: nftSaleAddress,
            functionName: 'ticketsOfUserBySize',
            args: [account, 0n, 600n],
          })

          const currentNumberTokensOfUser = await pancakeSquadContract.read.balanceOf(account)

          setCallback({
            canClaimForGen0: currentCanClaimForGen0,
            numberTicketsForGen0: Number(currentNumberTicketsForGen0),
            numberTicketsUsedForGen0: Number(currentNumberTicketsUsedForGen0),
            numberTicketsOfUser: Number(currentNumberTicketsOfUser),
            ticketsOfUser: currentTicketsOfUser,
            numberTokensOfUser: Number(currentNumberTokensOfUser),
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (nftSaleABI.length > 0) {
      fetchUserInfos()
    }
  }, [publicClient, account, refreshCounter, setCallback])
}

export default useUserInfos
