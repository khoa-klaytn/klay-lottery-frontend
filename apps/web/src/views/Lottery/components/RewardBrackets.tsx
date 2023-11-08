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
  amountToBurn: BigNumber
  rewardsLessTreasuryFee: BigNumber
  rewardPortions: string[]
  countWinnersPerBracket: string[]
}

const RewardBrackets: React.FC<React.PropsWithChildren<RewardMatchesProps>> = ({
  lotteryNodeData,
  isHistoricRound,
}) => {
  const { t } = useTranslation()
  const [state, setState] = useState<RewardsState>({
    isLoading: true,
    amountToBurn: BIG_ZERO,
    rewardsLessTreasuryFee: BIG_ZERO,
    rewardPortions: null,
    countWinnersPerBracket: null,
  })

  useEffect(() => {
    if (lotteryNodeData) {
      const { burnPortion, amountCollected, rewardPortions, countWinnersPerBracket } = lotteryNodeData

      const burnPercentage = new BigNumber(burnPortion).div(100)
      const amountToBurn = burnPercentage.div(100).times(new BigNumber(amountCollected))
      const amountLessTreasuryFee = new BigNumber(amountCollected).minus(amountToBurn)
      setState({
        isLoading: false,
        amountToBurn,
        rewardsLessTreasuryFee: amountLessTreasuryFee,
        rewardPortions,
        countWinnersPerBracket,
      })
    } else {
      setState({
        isLoading: true,
        amountToBurn: BIG_ZERO,
        rewardsLessTreasuryFee: BIG_ZERO,
        rewardPortions: null,
        countWinnersPerBracket: null,
      })
    }
  }, [lotteryNodeData])

  const getRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(state.rewardPortions[bracket]).div(100)
    return state.rewardsLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  const { isLoading, countWinnersPerBracket, amountToBurn } = state

  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes.')}{' '}
        {!isHistoricRound && t('Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        {[0, 1, 2, 3, 4, 5, 6].map((bracketIndex) => (
          <RewardBracketDetail
            key={bracketIndex}
            rewardBracket={bracketIndex}
            amount={!isLoading && getRewards(bracketIndex)}
            numberWinners={!isLoading && countWinnersPerBracket[bracketIndex]}
            isHistoricRound={isHistoricRound}
            isLoading={isLoading}
          />
        ))}
        <RewardBracketDetail rewardBracket={0} amount={amountToBurn} isBurn isLoading={isLoading} />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
