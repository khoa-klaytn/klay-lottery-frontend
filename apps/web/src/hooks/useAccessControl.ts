import { useActiveChainId } from 'hooks/useActiveChainId'
import { getAccessControlAddress } from 'utils/addressHelpers'

const useAccessControlAddress = () => {
  const { chainId } = useActiveChainId()
  const accessControlAddress = getAccessControlAddress(chainId)
  return accessControlAddress
}

export default useAccessControlAddress
