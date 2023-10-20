import { useActiveChainId } from 'hooks/useActiveChainId'
import { getKlayLotteryAddress } from 'utils/addressHelpers'

const useLotteryAddress = () => {
  const { chainId } = useActiveChainId()
  const lotteryAddress = getKlayLotteryAddress(chainId)
  return lotteryAddress
}

export default useLotteryAddress
