import { useTranslation } from '@sweepstakes/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance } from '@sweepstakes/uikit'
import { useAccount, useChainId, usePublicClient } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useSSLotteryContract } from 'hooks/useContract'
import { useCallback, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceAmount } from '@sweepstakes/utils/formatBalance'
import { SHORT_SYMBOL } from 'config/chains'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<React.PropsWithChildren<ClaimInnerProps>> = ({ onSuccess, roundsToClaim }) => {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const chainId = useChainId()
  const symbol = useMemo(() => SHORT_SYMBOL[chainId], [chainId])
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { maxNumberTicketsPerBuyOrClaim, currentLotteryId } = useLottery()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [pendingBatchClaims, setPendingBatchClaims] = useState(
    Math.ceil(
      roundsToClaim[activeClaimIndex].ticketsWithUnclaimedRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber(),
    ),
  )
  const lotteryContract = useSSLotteryContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const klayPriceBusd = useKlayPrice()

  const { total, ticketsWithUnclaimedRewards, roundId } = useMemo(
    () => roundsToClaim[activeClaimIndex],
    [roundsToClaim, activeClaimIndex],
  )

  const dollarRewardAsBalance = useMemo(
    () => getBalanceAmount(total.times(klayPriceBusd)).toNumber(),
    [total, klayPriceBusd],
  )
  const rewardAsBalance = useMemo(() => getBalanceAmount(total).toNumber(), [total])

  const ticketBatches = useMemo(() => {
    const requests: string[][] = []
    const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

    for (let batch = 0; batch < ticketsWithUnclaimedRewards.length; batch += maxAsNumber) {
      const batchRequests: string[] = []
      for (const { id } of ticketsWithUnclaimedRewards.slice(batch, maxAsNumber + batch)) {
        batchRequests.push(id)
      }
      requests.push(batchRequests)
    }

    return requests
  }, [ticketsWithUnclaimedRewards, maxNumberTicketsPerBuyOrClaim])

  const handleProgressToNextClaim = useCallback(() => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      dispatch(fetchUserLotteries({ publicClient, lotteryAddress, account, currentLotteryId }))
    } else {
      onSuccess()
    }
  }, [activeClaimIndex, currentLotteryId, dispatch, onSuccess, publicClient, lotteryAddress, roundsToClaim, account])

  const handleBatchClaim = useCallback(async () => {
    const transactionsToFire = ticketBatches.length
    const receipts = []
    // eslint-disable-next-line no-restricted-syntax
    for (const ticketBatch of ticketBatches) {
      /* eslint-disable no-await-in-loop */
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(lotteryContract, 'claimTickets', [roundId, ticketBatch])
      })
      if (receipt?.status) {
        // One transaction within batch has succeeded
        receipts.push(receipt)
        setPendingBatchClaims(transactionsToFire - receipts.length)

        // More transactions are to be done within the batch. Issue toast to give user feedback.
        if (receipts.length !== transactionsToFire) {
          toastSuccess(
            t('Prizes Collected!'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t(
                'Claim %claimNum% of %claimTotal% for round %roundId% was successful. Please confirm the next transaction',
                {
                  claimNum: receipts.length,
                  claimTotal: transactionsToFire,
                  roundId,
                },
              )}
            </ToastDescriptionWithTx>,
          )
        }
      } else {
        break
      }
    }

    // Batch is finished
    if (receipts.length === transactionsToFire) {
      toastSuccess(
        t('Prizes Collected!'),
        t('Your %symbol% prizes for round %roundId% have been sent to your wallet', { symbol, roundId }),
      )
      handleProgressToNextClaim()
    }
  }, [
    callWithGasPrice,
    ticketBatches,
    roundId,
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
        <Text mb="4px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={rewardAsBalance}
            fontSize="44px"
            bold
            color="secondary"
            unit={` ${symbol}!`}
          />
          <PresentWonIcon ml={['0', null, '12px']} width="64px" />
        </Flex>
        <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={dollarRewardAsBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        />
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {t('Round')} #{roundId}
        </Text>
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
