import { ChainId } from '@sweepstakes/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import V3AirdropModal from './V3AirdropModal'

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC = () => {
  const { account, chainId } = useAccountActiveChain()
  if (!enable || chainId !== ChainId.BSC || !account) {
    return null
  }
  return <GlobalCheckClaim key={account} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */

const GlobalCheckClaim: React.FC = () => {
  return (
    <>
      <V3AirdropModal />
    </>
  )
}

export default GlobalCheckClaimStatus
