import { ASSET_CDN } from 'config/constants/endpoints'
import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | SweepStakes',
  defaultTitle: 'SweepStakes',
  description:
    'Cheaper and faster than Uniswap? Discover SweepStakes, the leading DEX on BNB Smart Chain (BSC) with a lottery for KLAY.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@SweepStakes',
    site: '@SweepStakes',
  },
  openGraph: {
    title: '🥞 SweepStakes - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description: 'The most popular AMM on BSC by user count! Win it in the Lottery, on a platform you can trust.',
    images: [{ url: `${ASSET_CDN}/web/og/hero.jpg` }],
  },
}
