import { useState, useEffect } from 'react'
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

interface RewardsState {
  isLoading: boolean
  amountBurn: BigNumber
  rewardsPerBracket: BigNumber[]
  rewardPerUserPerBracket: BigNumber[]
  countWinnersPerBracket: string[]
}

const RewardBrackets: React.FC<React.PropsWithChildren<RewardMatchesProps>> = ({
  lotteryNodeData,
  isHistoricRound,
}) => {
  const { t } = useTranslation()
  const [state, setState] = useState<RewardsState>({
    isLoading: true,
    amountBurn: BIG_ZERO,
    rewardsPerBracket: null,
    rewardPerUserPerBracket: null,
    countWinnersPerBracket: null,
  })

  useEffect(() => {
    if (lotteryNodeData) {
      const {
        burnPortion,
        amountCollected,
        countWinnersPerBracket,
        rewardPerUserPerBracket: _rewardPerUserPerBracket,
      } = lotteryNodeData

      const amountBurn = amountCollected.times(burnPortion).div(10000)
      const rewardPerUserPerBracket = []
      const rewardsPerBracket = []
      const numBrackets = countWinnersPerBracket.length
      for (let i = numBrackets; i--; ) {
        const rewardPerUser = new BigNumber(_rewardPerUserPerBracket[i])
        rewardPerUserPerBracket[i] = rewardPerUser
        rewardsPerBracket[i] = rewardPerUser.times(countWinnersPerBracket[i])
      }

      setState({
        isLoading: false,
        amountBurn,
        rewardsPerBracket,
        rewardPerUserPerBracket,
        countWinnersPerBracket,
      })
    } else {
      setState({
        isLoading: true,
        amountBurn: BIG_ZERO,
        rewardsPerBracket: null,
        rewardPerUserPerBracket: null,
        countWinnersPerBracket: null,
      })
    }
  }, [lotteryNodeData])

  const { isLoading, amountBurn, rewardsPerBracket, rewardPerUserPerBracket, countWinnersPerBracket } = state

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
          rewardPerUser={!isLoading && rewardPerUserPerBracket[0]}
          numberWinners={!isLoading && countWinnersPerBracket[0]}
          isHistoricRound={isHistoricRound}
          isLoading={isLoading}
        />
        {[1, 2, 3, 4, 5].map((bracketIndex) => (
          <RewardBracketDetail
            key={bracketIndex}
            type="match"
            rewardBracket={bracketIndex}
            amount={!isLoading && rewardsPerBracket[bracketIndex]}
            rewardPerUser={!isLoading && rewardPerUserPerBracket[bracketIndex]}
            numberWinners={!isLoading && countWinnersPerBracket[bracketIndex]}
            isHistoricRound={isHistoricRound}
            isLoading={isLoading}
          />
        ))}
        <RewardBracketDetail
          type="matchAll"
          rewardBracket={6}
          amount={!isLoading && rewardsPerBracket[6]}
          rewardPerUser={!isLoading && rewardPerUserPerBracket[6]}
          numberWinners={!isLoading && countWinnersPerBracket[6]}
          isHistoricRound={isHistoricRound}
          isLoading={isLoading}
        />
        <RewardBracketDetail type="burn" amount={amountBurn} isLoading={isLoading} />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
