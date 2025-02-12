import { useState, useEffect, useMemo } from 'react'
import { styled } from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Text, Balance } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { LotteryRound, LotteryRoundGraphEntity } from 'state/types'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { getGraphLotteries } from 'state/lottery/getLotteriesData'
import { formatNumber, getBalanceNumber } from '@sweepstakes/utils/formatBalance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PreviousRoundCardFooter: React.FC<
  React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string }>
> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const [fetchedLotteryGraphData, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
  const lotteryGraphDataFromState = useGetLotteryGraphDataById(lotteryId)
  const klayPriceBusd = useKlayPrice()

  useEffect(() => {
    const getGraphData = async () => {
      const fetchedGraphData = await getGraphLotteries(undefined, undefined, { id_in: [lotteryId] })
      setFetchedLotteryGraphData(fetchedGraphData[0])
    }
    if (!lotteryGraphDataFromState) {
      getGraphData()
    }
  }, [lotteryGraphDataFromState, lotteryId])

  let prizeInBusd = useMemo(() => new BigNumber(NaN), [])
  if (lotteryNodeData) {
    const { amountCollected } = lotteryNodeData
    prizeInBusd = amountCollected.times(klayPriceBusd)
  }

  const totalUsers = useMemo(() => {
    if (!lotteryGraphDataFromState && fetchedLotteryGraphData) {
      return fetchedLotteryGraphData?.totalUsers
    }

    if (lotteryGraphDataFromState) {
      return lotteryGraphDataFromState?.totalUsers
    }

    return null
  }, [lotteryGraphDataFromState, fetchedLotteryGraphData])

  const prizeIsNaN = useMemo(() => prizeInBusd.isNaN(), [prizeInBusd])

  return (
    <NextDrawWrapper>
      <Flex mr="24px" flexDirection="column" justifyContent="space-between">
        <Box>
          <Heading>{t('Prize pot')}</Heading>
          {prizeIsNaN ? (
            <Skeleton my="7px" height={40} width={200} />
          ) : (
            <Heading scale="xl" lineHeight="1" color="secondary">
              ~${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)}
            </Heading>
          )}
          {prizeIsNaN ? (
            <Skeleton my="2px" height={14} width={90} />
          ) : (
            <Balance
              fontSize="14px"
              color="textSubtle"
              unit=" KLAY"
              value={getBalanceNumber(lotteryNodeData?.amountCollected)}
              decimals={0}
            />
          )}
        </Box>
        <Box mb="24px">
          <Flex>
            <Text fontSize="14px" display="inline">
              {t('Total players this round')}: {totalUsers || <Skeleton height={14} width={31} />}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <RewardBrackets lotteryNodeData={lotteryNodeData} isHistoricRound />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter
