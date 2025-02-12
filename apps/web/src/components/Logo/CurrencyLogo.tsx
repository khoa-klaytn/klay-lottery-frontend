import { Currency } from '@sweepstakes/sdk'
import { ChainId } from '@sweepstakes/chains'
import { BinanceIcon, TokenLogo } from '@sweepstakes/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@sweepstakes/token-lists'
import { styled } from 'styled-components'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useHttpLocations } from '@sweepstakes/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface LogoProps {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}

export function FiatLogo({ currency, size = '24px', style }: LogoProps) {
  return (
    <StyledLogo
      size={size}
      srcs={[`/images/currencies/${currency?.symbol?.toLowerCase()}.png`]}
      width={size}
      style={style}
    />
  )
}

export default function CurrencyLogo({ currency, size = '24px', style }: LogoProps) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return <StyledLogo size={size} srcs={[`${ASSET_CDN}/native/${currency.chainId}.png`]} width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
