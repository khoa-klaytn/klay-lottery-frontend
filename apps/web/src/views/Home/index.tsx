import { Box, PageSection, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAnniversaryEffect } from 'hooks/useAnniversaryEffect'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import MultipleBanner from './components/Banners/MultipleBanner'
import CommunitySection from './components/CommunitySection'
import { RightTopBox } from './components/CommunitySection/ImagesOnBg'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px', padding: '0px 16px' }
  const { isMobile } = useMatchBreakpoints()
  useAnniversaryEffect()
  return (
    <Box style={{ width: isMobile ? '100vw' : 'calc(100vw - 8px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: ${theme.colors.gradientBubblegum};
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: ${theme.colors.gradientContrast};
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #201335;
          }

          #bottom-wedge4-2 svg {
            fill: #72b8f2;
          }
          [data-theme='dark'] #bottom-wedge4-2 svg {
            fill: #0b4576;
          }
        `}
      </style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '16px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <MultipleBanner />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        containerProps={{
          id: 'home-3',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <RightTopBox />
        <CommunitySection />
      </PageSection>
    </Box>
  )
}

export default Home
