import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PancakeSwap',
  defaultTitle: 'PancakeSwap',
  description:
    'Cheaper and faster than Uniswap? Discover PancakeSwap, the leading DEX on BNB Smart Chain (BSC) with a lottery for CAKE.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@PancakeSwap',
    site: '@PancakeSwap',
  },
  openGraph: {
    title: '🥞 PancakeSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      'The most popular AMM on BSC by user count! Win it in the Lottery, then stake it in Syrup Pools to earn more tokens! NFTs and more on a platform you can trust.',
    images: [{ url: 'https://assets.pancakeswap.finance/web/og/hero.jpg' }],
  },
}
