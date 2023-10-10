import { Flex, Text, Box, ChevronRightIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { useMemo } from 'react'
import Image, { StaticImageData } from 'next/image'
import gameNftBunny from '../../images/game-nft-bunny.png'
import gamePancakeProtectors from '../../images/game-pancake-protectors.png'
import gameLottery from '../../images/game-lottery.png'
import gamePottery from '../../images/game-pottery.png'
import nftMarketplace from '../../images/nft-marketplace.png'
import GradientLogo from '../GradientLogoSvg'

import gamePancakeProtectorsPurple from '../../images/game-pancake-protectors-purple.png'
import gameLotteryPurple from '../../images/game-lottery-purple.png'
import gamePotteryPurple from '../../images/game-pottery-purple.png'
import nftMarketplacePurple from '../../images/nft-marketplace-purple.png'

export const CardWrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => (theme.isDark ? theme.colors.gradientBubblegum : theme.colors.backgroundAlt)};
  width: 100%;
  box-sizing: border-box;
  padding: 48px 24px 24px 24px;
  min-height: 360px;
  margin-top: 48px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1152px;
  }
`
export const ImageBox = styled.div`
  position: relative;
  transition: filter 0.25s linear;
  .default {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    .default {
      display: block;
      position: relative;
      z-index: 1;
    }
    .hover {
      transition: opacity 0.25s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 2;
    }
    // filter: invert(38%) sepia(97%) saturate(433%) hue-rotate(215deg) brightness(83%) contrast(86%);
  }
`

export const ItemWrapper = styled(Flex)<{ $flexBasis: number }>`
  align-items: left;
  justify-content: space-between;
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  cursor: pointer;
  .cta > * {
    transition: color 0.25s ease-in-out;
    path {
      transition: fill 0.25s ease-in-out;
    }
  }
  padding: 4px;
  &:hover {
    .cta > * {
      color: ${({ theme }) => theme.colors.primary};
      path {
        fill: ${({ theme }) => theme.colors.primary};
      }
    }
    ${ImageBox} {
      .hover {
        opacity: 1;
      }
      // filter: invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
  }
  flex-basis: calc(50% - 24px);

  &.type-a {
    height: 246px;
    ${({ theme }) => theme.mediaQueries.sm} {
      flex-basis: calc(33.3% - 48px);
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      height: 286px;
      &.higher {
        height: 292px;
      }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
  }
  &.type-b {
    height: 263px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      height: 286px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      height: 256px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-wrap: nowrap;
  }
`

export const FeatureBoxesWrapper = styled(Flex)`
  flex-wrap: wrap;
  gap: 24px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-wrap: nowrap;
  }
`

export const Title = styled.div`
  font-size: 32px;
  margin-bottom: 24px;
  font-weight: 600;
  line-height: 110%;
  padding-left: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const useNftGameBlockData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      {
        title: t('Pancake Protectors'),
        description: t('Immersive PvP & PvE tower-defense GameFi'),
        ctaTitle: t('Play Now'),
        image: gamePancakeProtectors,
        defaultImage: gamePancakeProtectorsPurple,
        path: 'https://protectors.pancakeswap.finance/',
      },
      {
        title: t('Lottery'),
        description: t('Enter for a chance to win CAKE prize pools'),
        ctaTitle: t('Try Now'),
        image: gameLottery,
        defaultImage: gameLotteryPurple,
        path: '/lottery',
      },
      {
        title: t('Pottery'),
        description: t('Stake CAKE, acquire pottery tickets, win prizes'),
        ctaTitle: t('Try Now'),
        image: gamePottery,
        defaultImage: gamePotteryPurple,
        path: '/pottery',
      },
      {
        title: t('NFT Marketplace'),
        description: t('Trade unique NFTs on BNB Chain'),
        ctaTitle: t('Trade Now'),
        image: nftMarketplace,
        defaultImage: nftMarketplacePurple,
        path: '/nfts',
      },
    ]
  }, [t])
}

const FeatureBox: React.FC<{
  title: string
  description: string
  image: StaticImageData
  defaultImage: StaticImageData
  width: number
  ctaTitle: string
  className?: string
  path?: string
  onClick?: () => void
}> = ({ title, description, image, defaultImage, ctaTitle, width, className, path, onClick }) => {
  const { theme } = useTheme()
  const { push } = useRouter()
  return (
    <ItemWrapper
      className={className}
      $flexBasis={width}
      onClick={onClick ? () => onClick() : () => path && push(path)}
    >
      <ImageBox>
        <Image className="default" src={defaultImage} width={108} height={108} alt={title} />
        <Image className="hover" src={image} width={108} height={108} alt={title} />
      </ImageBox>
      <Box>
        <Text fontSize="20px" mb="8px" lineHeight="110%" fontWeight={600} color={theme.colors.text}>
          {title}
        </Text>
        <Text fontSize="14px" lineHeight="120%" color={theme.colors.text}>
          {description}
        </Text>
      </Box>
      <Flex className="cta">
        <Text fontSize="16px" fontWeight={600} color={theme.colors.textSubtle}>
          {ctaTitle}
        </Text>
        <ChevronRightIcon color={theme.colors.textSubtle} />
      </Flex>
    </ItemWrapper>
  )
}

const EcoSystemSection: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const nftGameBlockData = useNftGameBlockData()
  const { isMobile, isMd } = useMatchBreakpoints()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={isMobile ? '24px' : '60px'}>
      <GradientLogo height="48px" width="48px" mb="24px" />
      <Text textAlign="center" p="0px 20px">
        <Text
          fontSize={['32px', null, null, '40px']}
          lineHeight="110%"
          display="inline-block"
          bold
          color={theme.colors.text}
        >
          {t('Discover the')}
        </Text>
        <Text
          fontSize={['32px', null, null, '40px']}
          ml="8px"
          display="inline-block"
          bold
          lineHeight="110%"
          color={theme.colors.secondary}
        >
          {t('Ecosystem')}
        </Text>
      </Text>
      <CardWrapper>
        <Flex
          style={{ gap: 32 }}
          flexDirection={isMobile || isMd ? 'column' : 'row'}
          alignItems={isMobile || isMd ? undefined : 'center'}
        >
          <Image
            style={{ marginLeft: isMobile ? -32 : -72 }}
            src={gameNftBunny}
            alt="gameNftBunny"
            width={344}
            height={360}
            placeholder="blur"
          />
          <Flex flexDirection="column">
            <Title>{t('Game & NFT')}</Title>
            <FeatureBoxesWrapper>
              {nftGameBlockData.map((item) => (
                <FeatureBox
                  className="type-a higher"
                  key={`${item.title}Block`}
                  title={item.title}
                  description={item.description}
                  defaultImage={item.defaultImage}
                  image={item.image}
                  width={100}
                  ctaTitle={item.ctaTitle}
                  path={item.path}
                />
              ))}
            </FeatureBoxesWrapper>
          </Flex>
        </Flex>
      </CardWrapper>
    </Flex>
  )
}

export default EcoSystemSection
