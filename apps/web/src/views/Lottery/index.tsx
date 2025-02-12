import { styled } from 'styled-components'
import { Box, Flex, Heading, Skeleton, PageSection } from '@sweepstakes/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@sweepstakes/localization'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { LotterySubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useState } from 'react'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import NextDrawCard from './components/NextDrawCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import useShowMoreUserHistory from './hooks/useShowMoreUserRounds'
import Admin from './Admin'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const { numUserRoundsRequested, handleShowMoreUserRounds } = useShowMoreUserHistory()

  return (
    <>
      <LotteryPage>
        <Admin />
        <PageSection background="var(--colors-gradientSecondary)" index={1} hasCurvedDivider={false}>
          <Hero />
        </PageSection>
        <PageSection
          background="var(--colors-gradientSecondary2)"
          containerProps={{ style: { marginTop: '-30px' } }}
          concaveDivider
          clipFill={{ light: 'var(--colors-secondary)' }}
          dividerPosition="top"
          index={2}
        >
          <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="24px">
            {status === LotteryStatus.OPEN && (
              <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
                {t('Get your tickets now!')}
              </Heading>
            )}
            <Flex alignItems="center" justifyContent="center" mb="48px">
              {nextEventTime && (postCountdownText || preCountdownText) ? (
                <Countdown
                  nextEventTime={nextEventTime}
                  postCountdownText={postCountdownText}
                  preCountdownText={preCountdownText}
                />
              ) : (
                <Skeleton height="41px" width="250px" />
              )}
            </Flex>
            <NextDrawCard />
          </Flex>
        </PageSection>
        <PageSection background="var(--colors-gradientBubblegum)" hasCurvedDivider={false} index={2}>
          <CheckPrizesSection />
        </PageSection>
        <PageSection
          position="relative"
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background="var(--colors-gradientOverlay)"
          hasCurvedDivider={false}
          index={2}
        >
          <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
            <Heading mb="24px" scale="xl">
              {t('Finished Rounds')}
            </Heading>
            <Box mb="24px">
              <HistoryTabMenu
                activeIndex={historyTabMenuIndex}
                setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
              />
            </Box>
            {historyTabMenuIndex === 0 ? (
              <AllHistoryCard />
            ) : (
              <YourHistoryCard
                handleShowMoreClick={handleShowMoreUserRounds}
                numUserRoundsRequested={numUserRoundsRequested}
              />
            )}
          </Flex>
        </PageSection>
        <LotterySubgraphHealthIndicator />
      </LotteryPage>
    </>
  )
}

export default Lottery
