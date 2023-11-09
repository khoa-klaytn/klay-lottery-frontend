import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text, Balance } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { getBalanceNumber, getFullDisplayBalance } from '@sweepstakes/utils/formatBalance'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SHORT_SYMBOL } from 'config/chains'
import { useMemo } from 'react'

interface RewardBracketDetailProps {
  amount: BigNumber
  type: 'allwinners' | 'match' | 'matchAll' | 'burn'
  rewardBracket?: number
  rewardPerUser?: BigNumber
  countWinners?: string
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  amount,
  type,
  rewardBracket,
  rewardPerUser,
  countWinners,
  isHistoricRound,
  isLoading,
}) => {
  const { chainId } = useActiveChainId()
  const symbol = SHORT_SYMBOL[chainId]
  const { t } = useTranslation()
  const klayPriceBusd = useKlayPrice()

  const rewardText = useMemo(() => {
    switch (type) {
      case 'allwinners':
        return t('All Winners')
      case 'match':
        return t('Match first %rewardBracket%', { rewardBracket })
      case 'matchAll':
        return t('Match all %rewardBracket%', { rewardBracket })
      case 'burn':
      default:
        return t('Burn')
    }
  }, [rewardBracket, t, type])
  const hasWinners = useMemo(() => countWinners !== '0', [countWinners])

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={type === 'burn' ? 'failure' : 'secondary'}>
          {rewardText}
        </Text>
      )}
      {isLoading || amount.isNaN() ? (
        <Skeleton my="4px" mr="10px" height={20} width={110} />
      ) : (
        hasWinners && <Balance fontSize="20px" bold unit={` ${symbol}`} value={getBalanceNumber(amount)} decimals={0} />
      )}
      {isLoading || amount.isNaN() ? (
        <>
          <Skeleton mt="4px" mb="16px" height={12} width={70} />
        </>
      ) : (
        hasWinners && (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(amount.times(klayPriceBusd))}
            decimals={0}
          />
        )
      )}
      {isHistoricRound && rewardPerUser && (
        <>
          {hasWinners && (
            <Text fontSize="12px" color="textSubtle">
              {getFullDisplayBalance(rewardPerUser, 18, 2)} {symbol} {t('each')}
            </Text>
          )}
          <Text fontSize="12px" color="textSubtle">
            {countWinners} {t('Winning Tickets')}
          </Text>
        </>
      )}
    </Flex>
  )
}

export default RewardBracketDetail
