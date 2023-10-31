import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'
import { withWebSecurityHeaders } from '@sweepstakes/next-config/withWebSecurityHeaders'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@sweepstakes/uikit',
    '@sweepstakes/hooks',
    '@sweepstakes/localization',
    '@sweepstakes/utils',
    '@0xsquid/widget',
  ],
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/aptos',
        destination: '/stargate',
        permanent: true,
      },
    ]
  }
}

export default withAxiom(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
