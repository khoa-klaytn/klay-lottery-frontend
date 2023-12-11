import { useTranslation } from '@sweepstakes/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance } from '@sweepstakes/uikit'
import { useChainId } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useSSLotteryContract } from 'hooks/useContract'
import { useCallback, useMemo, useState } from 'react'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceAmount } from '@sweepstakes/utils/formatBalance'
import { SHORT_SYMBOL } from 'config/chains'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import BigNumber from 'bignumber.js'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<React.PropsWithChildren<ClaimInnerProps>> = ({ onSuccess, roundsToClaim }) => {
  const chainId = useChainId()
  const symbol = useMemo(() => SHORT_SYMBOL[chainId], [chainId])
  const { t } = useTranslation()
  const { currentLotteryId, maxNumberTicketsPerBuyOrClaim } = useLottery()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { previousTotal, total, ticketsWithUnclaimedRewards } = useMemo(() => {
    let _previousTotal = BIG_ZERO
    let _total = BIG_ZERO
    const _ticketsWithUnclaimedRewards = Array<[string, LotteryTicket]>()
    for (const {
      roundId,
      ticketsWithUnclaimedRewards: roundTicketsWithUnclaimedRewards,
      total: roundTotal,
    } of roundsToClaim) {
      _total = _total.plus(roundTotal)
      if (roundId !== currentLotteryId) {
        _previousTotal = _previousTotal.plus(roundTotal)
      }
      for (const ticket of roundTicketsWithUnclaimedRewards) {
        _ticketsWithUnclaimedRewards.push([roundId, ticket])
      }
    }
    return {
      previousTotal: _previousTotal,
      ticketsWithUnclaimedRewards: _ticketsWithUnclaimedRewards.sort(
        ([, { reward: aReward }], [, { reward: bReward }]) => (new BigNumber(aReward).gt(bReward) ? -1 : 1),
      ),
      total: _total,
    }
  }, [currentLotteryId, roundsToClaim])
  const [pendingBatchClaims, setPendingBatchClaims] = useState(
    Math.ceil(ticketsWithUnclaimedRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber()),
  )
  const lotteryContract = useSSLotteryContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const klayPriceBusd = useKlayPrice()

  const previousTotalAsBalance = useMemo(() => getBalanceAmount(previousTotal).toNumber(), [previousTotal])
  const totalAsBalance = useMemo(() => getBalanceAmount(total).toNumber(), [total])
  const totalAsDollarBalance = useMemo(
    () => getBalanceAmount(total.times(klayPriceBusd)).toNumber(),
    [total, klayPriceBusd],
  )

  const ticketBatches = useMemo(() => {
    const requests: [string[], string[]][] = []
    const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

    for (let batch = ticketsWithUnclaimedRewards.length; batch > 0; batch -= maxAsNumber) {
      const batchRequests: [string[], string[]] = [[], []]
      for (const [roundId, { id }] of ticketsWithUnclaimedRewards.slice(Math.max(batch - maxAsNumber, 0), batch)) {
        batchRequests[0].push(roundId)
        batchRequests[1].push(id)
      }
      requests.push(batchRequests)
    }
    return requests
  }, [ticketsWithUnclaimedRewards, maxNumberTicketsPerBuyOrClaim])

  const handleProgressToNextClaim = useCallback(async () => {
    onSuccess()
  }, [onSuccess])

  const handleBatchClaim = useCallback(async () => {
    const transactionsToFire = ticketBatches.length
    // eslint-disable-next-line no-restricted-syntax
    let prevBatch = pendingBatchClaims
    while (prevBatch) {
      const batch = prevBatch - 1
      const ticketBatch = ticketBatches[batch]
      /* eslint-disable no-await-in-loop */
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(lotteryContract, 'claimTickets', ticketBatch)
      })
      // One transaction within batch has succeeded
      if (receipt?.status) {
        prevBatch = batch
        // More transactions are to be done within the batch. Issue toast to give user feedback.
        if (prevBatch) {
          toastSuccess(
            t('Prizes Collected!'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Claim %claimNum% of %claimTotal% was successful. Please confirm the next transaction', {
                claimNum: transactionsToFire - prevBatch,
                claimTotal: transactionsToFire,
              })}
            </ToastDescriptionWithTx>,
          )
        }
      } else {
        break
      }
    }
    setPendingBatchClaims(prevBatch)

    // Batch is finished
    if (prevBatch === 0) {
      toastSuccess(t('Prizes Collected!'), t('Your %symbol% prizes have been sent to your wallet', { symbol }))
      await handleProgressToNextClaim()
    }
  }, [
    callWithGasPrice,
    ticketBatches,
    pendingBatchClaims,
    fetchWithCatchTxError,
    handleProgressToNextClaim,
    lotteryContract,
    symbol,
    t,
    toastSuccess,
  ])

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="8px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['center', null, 'flex-start']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Flex flexDirection="column" alignItems={['center', null, 'flex-start']}>
            <Balance
              textAlign="center"
              lineHeight="1.2"
              value={totalAsBalance}
              fontSize="44px"
              bold
              color="secondary"
              unit={` ${symbol}!`}
            />
            <Text textAlign="center">
              <Text display="inline" fontSize="19px" marginRight="1.5px">
                (
              </Text>
              <Balance
                fontSize="20px"
                display="inline"
                value={previousTotalAsBalance}
                bold
                color="secondary"
                unit={` ${symbol}`}
              />
              {' from previous rounds'}
              <Text display="inline" fontSize="19px" marginLeft="1.5px">
                )
              </Text>
            </Text>
          </Flex>
          <PresentWonIcon ml={['0', null, '15px']} width="64px" />
        </Flex>
        <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={totalAsDollarBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        />
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={handleBatchClaim}
        >
          {pendingTx ? t('Claiming') : t('Claim')} {pendingBatchClaims > 1 ? `(${pendingBatchClaims})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
