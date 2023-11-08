import { LotteryTicket } from 'config/constants/types'
import { Flex, Text } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { styled } from 'styled-components'
import _uniqueId from 'lodash/uniqueId'

const StyledNumberWrapper = styled(Flex)`
  position: relative;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.background};
  justify-content: space-between;
`

function bracketWidth(numBrackets: number) {
  const baseBracketWidth = 100 / numBrackets
  return baseBracketWidth
}

const RewardHighlighter = styled.div<{ rewardBracket: number; numBrackets: number }>`
  z-index: 1;
  width: ${({ rewardBracket, numBrackets }) =>
    `${rewardBracket < numBrackets ? rewardBracket * bracketWidth(numBrackets) : 100}%`};
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.default};
  top: 0;
  left: 0;
  position: absolute;
  border: 2px ${({ theme }) => theme.colors.primary} solid;
`

interface TicketNumberProps extends LotteryTicket {
  localId?: number
  rewardBracket?: number
  numBrackets?: number
}

const TicketNumber: React.FC<React.PropsWithChildren<TicketNumberProps>> = ({
  localId,
  id,
  number,
  rewardBracket,
  numBrackets,
}) => {
  const { t } = useTranslation()

  // TODO: translate "Matches all"
  return (
    <Flex flexDirection="column" mb="12px">
      <Flex justifyContent="space-between">
        <Text fontSize="12px" color="textSubtle">
          #{localId || id}
        </Text>
        {rewardBracket > 0 && (
          <Text fontSize="12px">
            {rewardBracket === numBrackets ? 'Matches all' : t('Matched first')} {rewardBracket}
          </Text>
        )}
      </Flex>
      <StyledNumberWrapper>
        {rewardBracket > 0 && <RewardHighlighter rewardBracket={rewardBracket} numBrackets={6} />}
        {number.map((digit) => (
          <Text key={`${localId || id}-${digit}-${_uniqueId()}`} fontSize="16px">
            {digit}
          </Text>
        ))}
      </StyledNumberWrapper>
    </Flex>
  )
}

export default TicketNumber
