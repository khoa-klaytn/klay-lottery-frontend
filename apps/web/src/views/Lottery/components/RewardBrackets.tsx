import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@sweepstakes/uikit'
import { styled } from 'styled-components'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import { useTranslation } from '@sweepstakes/localization'
import { LotteryRound } from 'state/types'
import RewardBracketDetail from './RewardBracketDetail'

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface RewardMatchesProps {
  lotteryNodeData: LotteryRound
  isHistoricRound?: boolean
}

const RewardBrackets: React.FC<React.PropsWithChildren<RewardMatchesProps>> = ({
  lotteryNodeData,
  isHistoricRound,
}) => {
  const { t } = useTranslation()
  const { isLoading, amountBurn, rewardsPerBracket, rewardPerUserPerBracket, countWinnersPerBracket } = useMemo(() => {
    if (lotteryNodeData) {
      const { burnPortion, amountCollected } = lotteryNodeData
      const _amountBurn = amountCollected.times(burnPortion).div(10000)
      const _rewardsPerBracket = []

      if (isHistoricRound) {
        const { countWinnersPerBracket: _countWinnersPerBracket, rewardPerUserPerBracket: __rewardPerUserPerBracket } =
          lotteryNodeData

        const _rewardPerUserPerBracket = []
        const numBrackets = _countWinnersPerBracket.length
        for (let i = numBrackets; i--; ) {
          const rewardPerUser = new BigNumber(__rewardPerUserPerBracket[i])
          _rewardPerUserPerBracket[i] = rewardPerUser
          _rewardsPerBracket[i] = rewardPerUser.times(_countWinnersPerBracket[i])
        }

        return {
          isLoading: false,
          amountBurn: _amountBurn,
          rewardsPerBracket: _rewardsPerBracket,
          rewardPerUserPerBracket: _rewardPerUserPerBracket,
          countWinnersPerBracket: _countWinnersPerBracket,
        }
      }

      const { rewardPortions } = lotteryNodeData

      const numBrackets = rewardPortions.length
      for (let i = numBrackets; i--; ) {
        _rewardsPerBracket[i] = amountCollected.times(rewardPortions[i]).div(10000)
      }

      return {
        isLoading: false,
        amountBurn: _amountBurn,
        rewardsPerBracket: _rewardsPerBracket,
        rewardPerUserPerBracket: null,
        countWinnersPerBracket: null,
      }
    }
    return {
      isLoading: true,
      amountBurn: BIG_ZERO,
      rewardsPerBracket: null,
      rewardPerUserPerBracket: null,
      countWinnersPerBracket: null,
    }
  }, [lotteryNodeData, isHistoricRound])

  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes.')}{' '}
        {!isHistoricRound && t('Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        <RewardBracketDetail
          type="allwinners"
          rewardBracket={0}
          amount={!isLoading && rewardsPerBracket[0]}
          rewardPerUser={rewardPerUserPerBracket && rewardPerUserPerBracket[0]}
          countWinners={countWinnersPerBracket && countWinnersPerBracket[0]}
          isHistoricRound={isHistoricRound}
          isLoading={isLoading}
        />
        {[1, 2, 3, 4, 5].map((bracketIndex) => (
          <RewardBracketDetail
            key={bracketIndex}
            type="match"
            rewardBracket={bracketIndex}
            amount={!isLoading && rewardsPerBracket[bracketIndex]}
            rewardPerUser={rewardPerUserPerBracket && rewardPerUserPerBracket[bracketIndex]}
            countWinners={countWinnersPerBracket && countWinnersPerBracket[bracketIndex]}
            isHistoricRound={isHistoricRound}
            isLoading={isLoading}
          />
        ))}
        <RewardBracketDetail
          type="matchAll"
          rewardBracket={6}
          amount={!isLoading && rewardsPerBracket[6]}
          rewardPerUser={rewardPerUserPerBracket && rewardPerUserPerBracket[6]}
          countWinners={countWinnersPerBracket && countWinnersPerBracket[6]}
          isHistoricRound={isHistoricRound}
          isLoading={isLoading}
        />
        <RewardBracketDetail type="burn" amount={amountBurn} isLoading={isLoading} />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
