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
    description: 'Win it in the Lottery, on a platform you can trust.',
  },
}
