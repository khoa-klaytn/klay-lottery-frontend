import Image from 'next/image'
import { HelpIcon } from '@sweepstakes/uikit'
import { isChainSupported } from 'utils/wagmi'
import { memo } from 'react'

export const ChainLogo = memo(
  ({ chainId, width = 24, height = 24 }: { chainId: number; width?: number; height?: number }) => {
    if (isChainSupported(chainId)) {
      return (
        <Image
          alt={`chain-${chainId}`}
          style={{ maxHeight: `${height}px` }}
          src="https://klaytn.foundation/wp-content/themes/klaytn/download/klaytn-symbol.svg"
          width={width}
          height={height}
          unoptimized
        />
      )
    }

    return <HelpIcon width={width} height={height} />
  },
)
