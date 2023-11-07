import { useActiveChainId } from 'hooks/useActiveChainId'
import { getSSLotteryAddress } from 'utils/addressHelpers'

const useLotteryAddress = () => {
  const { chainId } = useActiveChainId()
  const lotteryAddress = getSSLotteryAddress(chainId)
  return lotteryAddress
}

export default useLotteryAddress
