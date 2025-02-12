import { useTranslation } from '@sweepstakes/localization'
import { Flex, Text, useMatchBreakpoints } from '@sweepstakes/uikit'
import Image from 'next/legacy/image'
import { styled } from 'styled-components'
import useSWRImmutable from 'swr/immutable'
import aptosBallRocket from '../../images/aptos-ball-rocket.png'
import bnbBallRocket from '../../images/bnb-ball-rocket.png'
import ethBallRocket from '../../images/eth-ball-rocket.png'
import { ChainTags } from './ChainTags'
import { MetricsCard } from './MetricsCard'

const ImageLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`
const BnbBallRocket = styled.div`
  position: absolute;
  left: -65px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    bottom: 151px;
    left: 20px;
  }
`
const EthBallRocket = styled.div`
  position: absolute;
  right: 0;
  top: 81px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
    bottom: -30px;
  }
`

const AptosBallRocket = styled.div`
  position: absolute;
  top: 0px;
  right: 98px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    top: 72px;
    right: 119px;
  }
`

const Stats = () => {
  const { t } = useTranslation()
  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const { isMobile, isSm, isMd, isXxl } = useMatchBreakpoints()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" overflow="hidden">
      {/* <GradientLogo height="48px" width="48px" mb="24px" /> */}
      <Text textAlign="center" lineHeight="110%" fontWeight={600} mb="4px" fontSize={isMobile ? '20px' : '32px'}>
        {t('Shaping the Future of Decentralized Trading:')}
      </Text>
      <Text
        textAlign="center"
        lineHeight="110%"
        fontWeight={600}
        fontSize={isMobile ? '20px' : '32px'}
        mb={isMobile ? '32px' : '48px'}
      >
        {t('SweepStakes’s Unstoppable Expansion')}
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection={isMobile ? 'column' : 'row'}
        width={['100%', '100%', '100%', '800px']}
        style={{ gap: isMobile ? 32 : 50 }}
        mb={isMobile ? '32px' : '48px'}
        flexWrap="wrap"
      >
        <MetricsCard
          width={isSm || isMd ? '100%' : 'auto'}
          title={t('Total Users:')}
          value={addressCount}
          description={t('in the last 30 days')}
        />
        <MetricsCard
          title={t('Total Trading Volume:')}
          value={txCount}
          description={t('in the last 30 days')}
          prefix="$"
        />
        <MetricsCard title={t('Total Value Locked:')} value={tvl} description={t('in the last 30 days')} prefix="$" />
      </Flex>
      <ChainTags />
      <ImageLayer>
        <BnbBallRocket>
          <Image src={bnbBallRocket} alt="bnbBallRocket" width={144} height={168} placeholder="blur" />
        </BnbBallRocket>
        <EthBallRocket>
          <Image
            src={ethBallRocket}
            alt="ethBallRocket"
            width={isXxl ? 116 : 70}
            height={isXxl ? 230 : 140}
            placeholder="blur"
          />
        </EthBallRocket>
        <AptosBallRocket>
          <Image
            src={aptosBallRocket}
            alt="aptosBallRocket"
            width={isXxl ? 84 : 53}
            height={isXxl ? 101 : 64}
            placeholder="blur"
          />
        </AptosBallRocket>
      </ImageLayer>
    </Flex>
  )
}

export default Stats
