import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance } from '@pancakeswap/uikit'
import { useAccount, useChainId, usePublicClient } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useKlayLotteryContract } from 'hooks/useContract'
import { useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { useCakePrice } from 'hooks/useCakePrice'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { SHORT_SYMBOL } from 'config/chains'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<React.PropsWithChildren<ClaimInnerProps>> = ({ onSuccess, roundsToClaim }) => {
  const publicClient = usePublicClient()
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
  const lotteryContract = useKlayLotteryContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const activeClaimData = roundsToClaim[activeClaimIndex]

  const cakePriceBusd = useCakePrice()
  const reward = activeClaimData.total
  const dollarReward = reward.times(cakePriceBusd)
  const rewardAsBalance = getBalanceAmount(reward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()

  const parseUnclaimedTicketDataForClaimCall = (ticketsWithUnclaimedRewards: LotteryTicket[], lotteryId: string) => {
    const ticketIds = ticketsWithUnclaimedRewards.map((ticket) => {
      return ticket.id
    })
    return { lotteryId, ticketIds }
  }

  const claimTicketsCallData = parseUnclaimedTicketDataForClaimCall(
    activeClaimData.ticketsWithUnclaimedRewards,
    activeClaimData.roundId,
  )

  const shouldBatchRequest = maxNumberTicketsPerBuyOrClaim.lt(claimTicketsCallData.ticketIds.length)

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      dispatch(fetchUserLotteries({ publicClient, account, currentLotteryId }))
    } else {
      onSuccess()
    }
  }

  const getTicketBatches = (ticketIds: string[]): { ticketIds: string[] }[] => {
    const requests = []
    const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

    for (let i = 0; i < ticketIds.length; i += maxAsNumber) {
      const ticketIdsSlice = ticketIds.slice(i, maxAsNumber + i)
      requests.push({ ticketIds: ticketIdsSlice })
    }

    return requests
  }

  const handleClaim = async () => {
    const { lotteryId, ticketIds } = claimTicketsCallData
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(lotteryContract, 'claimTickets', [lotteryId, ticketIds])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Prizes Collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% prizes for round %lotteryId% have been sent to your wallet', { symbol, lotteryId })}
        </ToastDescriptionWithTx>,
      )
      handleProgressToNextClaim()
    }
  }

  const handleBatchClaim = async () => {
    const { lotteryId, ticketIds } = claimTicketsCallData
    const ticketBatches = getTicketBatches(ticketIds)
    const transactionsToFire = ticketBatches.length
    const receipts = []
    // eslint-disable-next-line no-restricted-syntax
    for (const ticketBatch of ticketBatches) {
      /* eslint-disable no-await-in-loop */
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(lotteryContract, 'claimTickets', [lotteryId, ticketBatch.ticketIds])
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
                'Claim %claimNum% of %claimTotal% for round %lotteryId% was successful. Please confirm the next transaction',
                {
                  claimNum: receipts.length,
                  claimTotal: transactionsToFire,
                  lotteryId,
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
        t('Your %symbol% prizes for round %lotteryId% have been sent to your wallet', { symbol, lotteryId }),
      )
      handleProgressToNextClaim()
    }
  }

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
          {t('Round')} #{activeClaimData.roundId}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => (shouldBatchRequest ? handleBatchClaim() : handleClaim())}
        >
          {pendingTx ? t('Claiming') : t('Claim')} {pendingBatchClaims > 1 ? `(${pendingBatchClaims})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
