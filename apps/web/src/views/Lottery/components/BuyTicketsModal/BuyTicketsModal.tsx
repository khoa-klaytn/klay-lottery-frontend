import { useTranslation } from '@sweepstakes/localization'
import {
  ArrowForwardIcon,
  BalanceInput,
  Button,
  Flex,
  HelpIcon,
  Modal,
  Text,
  Ticket,
  useToast,
  useTooltip,
} from '@sweepstakes/uikit'
import { useAccount, usePublicClient } from 'wagmi'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import useConfirmTransaction from 'hooks/useConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useSSLotteryContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { useKlayPrice } from 'hooks/useKlayPrice'
import { fetchUserTicketsAndLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { styled } from 'styled-components'
import { BIG_ZERO, BIG_ONE_HUNDRED, BIG_ONE } from '@sweepstakes/utils/bigNumber'
import { getFullDisplayBalance } from '@sweepstakes/utils/formatBalance'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SHORT_SYMBOL } from 'config/chains'
import SSLotteryABI from 'config/abi/SSLottery'
import { handleCustomError } from 'utils/viem'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
import EditNumbersModal from './EditNumbersModal'
import NumTicketsToBuyButton from './NumTicketsToBuyButton'
import { useTicketsReducer } from './useTicketsReducer'
import TooltipComponent from './Tooltip'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

const ShortcutButtonsWrapper = styled(Flex)<{ isVisible: boolean }>`
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 24px;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
`

interface BuyTicketsModalProps {
  onDismiss?: () => void
}

enum BuyingStage {
  BUY = 'Buy',
  EDIT = 'Edit',
}

const BuyTicketsModal: React.FC<React.PropsWithChildren<BuyTicketsModalProps>> = ({ onDismiss }) => {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const { chainId } = useActiveChainId()
  const symbol = SHORT_SYMBOL[chainId]
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    maxNumberTicketsPerBuyOrClaim,
    currentLotteryId,
    currentRound: {
      ticketPrice,
      discountDivisor,
      userTickets: { tickets: userCurrentTickets },
    },
  } = useLottery()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [ticketsToBuy, setTicketsToBuy] = useState(BIG_ZERO)
  const [discountValue, setDiscountValue] = useState('')
  const [discountPct, setDiscountPct] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [ticketCostBeforeDiscount, setTicketCostBeforeDiscount] = useState('')
  const [buyingStage, setBuyingStage] = useState<BuyingStage>(BuyingStage.BUY)
  const lotteryContract = useSSLotteryContract()
  const { toastSuccess } = useToast()
  const [balance, setBalance] = useState(BIG_ZERO)
  const klayPriceBusd = useKlayPrice()
  const dispatch = useAppDispatch()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  const maxPossibleTicketPurchase = useMemo(() => {
    // https://www.desmos.com/calculator/uertqqvlui
    const discountDivisorPlus1 = discountDivisor.plus(1)
    const b2 = discountDivisorPlus1.pow(2)
    const fourAC = balance.times(4).times(discountDivisor).div(ticketPrice)
    const discriminant = b2.minus(fourAC)
    const max = discountDivisorPlus1.minus(discriminant.sqrt()).div(2)
    if (max.isNaN()) {
      return maxNumberTicketsPerBuyOrClaim
    }
    return max.integerValue(BigNumber.ROUND_DOWN)
  }, [discountDivisor, balance, ticketPrice, maxNumberTicketsPerBuyOrClaim])

  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [zeroTicketPurchase, setZeroTicketPurchase] = useState(false)
  const [maxTicketPurchaseExceeded, setMaxTicketPurchaseExceeded] = useState(false)
  const eMsg = useMemo(() => {
    if (insufficientBalance) {
      return t('Insufficient Balance')
    }
    if (zeroTicketPurchase) {
      return t('At least one ticket must be purchased')
    }
    if (maxTicketPurchaseExceeded) {
      return t('The maximum number of tickets you can buy in one transaction is %maxTickets%', {
        maxTickets: maxNumberTicketsPerBuyOrClaim.toString(),
      })
    }
    return ''
  }, [t, insufficientBalance, zeroTicketPurchase, maxTicketPurchaseExceeded, maxNumberTicketsPerBuyOrClaim])

  const limitNumberTickets = useCallback(
    (number: BigNumber) => {
      let limitedNumber = number
      if (number.lt(0)) {
        limitedNumber = BIG_ZERO
      } else if (number.gt(maxNumberTicketsPerBuyOrClaim)) {
        limitedNumber = maxNumberTicketsPerBuyOrClaim
      }
      return limitedNumber
    },
    [maxNumberTicketsPerBuyOrClaim],
  )

  const getTicketCostAfterDiscount = useCallback(
    (numberTickets: BigNumber) => {
      const totalAfterDiscount = ticketPrice
        .times(numberTickets)
        .times(discountDivisor.plus(1).minus(numberTickets))
        .div(discountDivisor)
      return totalAfterDiscount
    },
    [discountDivisor, ticketPrice],
  )

  type NumTicketsByPercentage = Record<
    'tenPercentOfBalance' | 'twentyFivePercentOfBalance' | 'fiftyPercentOfBalance' | 'oneHundredPercentOfBalance',
    BigNumber
  >
  const { tenPercentOfBalance, twentyFivePercentOfBalance, fiftyPercentOfBalance, oneHundredPercentOfBalance } =
    useMemo<NumTicketsByPercentage>(() => {
      if (maxPossibleTicketPurchase.eq(0)) {
        return {
          tenPercentOfBalance: BIG_ZERO,
          twentyFivePercentOfBalance: BIG_ZERO,
          fiftyPercentOfBalance: BIG_ZERO,
          oneHundredPercentOfBalance: BIG_ZERO,
        }
      }
      function getNumTicketsByPercentage(percentage: number) {
        return maxPossibleTicketPurchase
          .times(new BigNumber(percentage))
          .div(BIG_ONE_HUNDRED)
          .integerValue(BigNumber.ROUND_DOWN)
      }
      const numTicketsByPercentage = {} as NumTicketsByPercentage
      numTicketsByPercentage.tenPercentOfBalance = getNumTicketsByPercentage(10)
      numTicketsByPercentage.twentyFivePercentOfBalance = getNumTicketsByPercentage(25)
      numTicketsByPercentage.fiftyPercentOfBalance = getNumTicketsByPercentage(50)
      numTicketsByPercentage.oneHundredPercentOfBalance = maxPossibleTicketPurchase
      return numTicketsByPercentage
    }, [maxPossibleTicketPurchase])

  const handleInputChange = useCallback(
    (input: BigNumber) => {
      // Force input to integer
      setZeroTicketPurchase(input.eq(BIG_ZERO))
      setMaxTicketPurchaseExceeded(input.gt(maxNumberTicketsPerBuyOrClaim))

      const limitedNumberTickets = limitNumberTickets(input)
      const costAfterDiscount = getTicketCostAfterDiscount(limitedNumberTickets)

      setInsufficientBalance(costAfterDiscount.gt(balance))
      setTicketsToBuy(limitedNumberTickets)

      const costBeforeDiscount = ticketPrice.times(limitedNumberTickets)
      const discountBeingApplied = costBeforeDiscount.minus(costAfterDiscount)
      setTicketCostBeforeDiscount(costBeforeDiscount.gt(0) ? getFullDisplayBalance(costBeforeDiscount) : '0')
      setTotalCost(costAfterDiscount.gt(0) ? getFullDisplayBalance(costAfterDiscount) : '0')
      setDiscountValue(discountBeingApplied.gt(0) ? getFullDisplayBalance(discountBeingApplied, 18, 5) : '0')
      setDiscountPct(
        discountBeingApplied.gt(0) ? discountBeingApplied.div(costBeforeDiscount).times(100).toFixed(2) : '0',
      )
    },
    [limitNumberTickets, getTicketCostAfterDiscount, ticketPrice, balance, maxNumberTicketsPerBuyOrClaim],
  )

  const [updateTicket, randomize, tickets, allComplete, getTicketsForPurchase] = useTicketsReducer(
    ticketsToBuy.toNumber(),
    userCurrentTickets,
  )

  const onConfirm = useCallback(async () => {
    const ticketsForPurchase = getTicketsForPurchase()
    const value = await publicClient.readContract({
      abi: SSLotteryABI,
      address: lotteryContract.address,
      functionName: 'calculateCurrentTotalPriceForBulkTickets',
      args: [BigInt(ticketsForPurchase.length)],
    })
    let res
    try {
      res = await callWithGasPrice(lotteryContract, 'buyTickets', [BigInt(currentLotteryId), ticketsForPurchase], {
        value,
      })
      console.log(res)
    } catch (e) {
      handleCustomError(e)
    }
    return res
  }, [callWithGasPrice, currentLotteryId, getTicketsForPurchase, lotteryContract, publicClient])
  const { isConfirming, handleConfirm } = useConfirmTransaction({
    onConfirm,
    onSuccess: async ({ receipt }) => {
      onDismiss?.()
      dispatch(fetchUserTicketsAndLotteries({ publicClient, lotteryAddress, account, currentLotteryId }))
      toastSuccess(t('Lottery tickets purchased!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
  })

  const disableBuying = useMemo(
    () =>
      isConfirming ||
      insufficientBalance ||
      !ticketsToBuy ||
      zeroTicketPurchase ||
      maxTicketPurchaseExceeded ||
      !ticketsToBuy.eq(getTicketsForPurchase().length),
    [
      isConfirming,
      insufficientBalance,
      maxTicketPurchaseExceeded,
      ticketsToBuy,
      zeroTicketPurchase,
      getTicketsForPurchase,
    ],
  )

  const displayBalance = useMemo(() => getFullDisplayBalance(balance, 18, 3), [balance])

  useEffect(() => {
    if (account) {
      ;(async () => {
        const newBalance = await publicClient.getBalance({ address: account })
        setBalance(new BigNumber(newBalance.toString()))
      })()
    }
  }, [account, publicClient])

  useEffect(() => {
    handleInputChange(BIG_ONE)
  }, [handleInputChange])

  if (buyingStage === BuyingStage.EDIT) {
    return (
      <EditNumbersModal
        totalCost={totalCost}
        updateTicket={updateTicket}
        randomize={randomize}
        tickets={tickets}
        allComplete={allComplete}
        disableBuying={disableBuying}
        onConfirm={handleConfirm}
        isConfirming={isConfirming}
        onDismiss={() => setBuyingStage(BuyingStage.BUY)}
      />
    )
  }

  return (
    <StyledModal title={t('Buy Tickets')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      {tooltipVisible && tooltip}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle">{t('Buy')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Text mr="4px" bold>
            {t('Tickets')}
          </Text>
          <Ticket />
        </Flex>
      </Flex>
      <BalanceInput
        isWarning={account && Boolean(eMsg)}
        placeholder="0"
        value={ticketsToBuy.toString()}
        onUserInput={(input) => {
          handleInputChange(new BigNumber(input || 0))
        }}
        currencyValue={klayPriceBusd.gt(0) && `~${ticketsToBuy ? ticketCostBeforeDiscount : '0.00'} ${symbol}`}
      />
      <Flex alignItems="center" justifyContent="flex-end" mt="4px" mb="12px">
        <Flex justifyContent="flex-end" flexDirection="column">
          {account && eMsg && (
            <Text fontSize="12px" color="failure">
              {eMsg}
            </Text>
          )}
          {account && (
            <Flex justifyContent="flex-end">
              <Text fontSize="12px" color="textSubtle" mr="4px">
                {symbol} {t('Balance')}:
              </Text>
              <Text fontSize="12px" color="textSubtle">
                {displayBalance}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>

      <ShortcutButtonsWrapper isVisible={account && oneHundredPercentOfBalance.gt(0)}>
        {tenPercentOfBalance.gt(0) && (
          <NumTicketsToBuyButton onClick={() => handleInputChange(tenPercentOfBalance)}>
            {tenPercentOfBalance.toString()}
          </NumTicketsToBuyButton>
        )}
        {twentyFivePercentOfBalance.gt(0) && (
          <NumTicketsToBuyButton onClick={() => handleInputChange(twentyFivePercentOfBalance)}>
            {twentyFivePercentOfBalance.toString()}
          </NumTicketsToBuyButton>
        )}
        {fiftyPercentOfBalance.gt(0) && (
          <NumTicketsToBuyButton onClick={() => handleInputChange(fiftyPercentOfBalance)}>
            {fiftyPercentOfBalance.toString()}
          </NumTicketsToBuyButton>
        )}
        {oneHundredPercentOfBalance.gt(0) && (
          <NumTicketsToBuyButton onClick={() => handleInputChange(oneHundredPercentOfBalance)}>
            <Text small color="currentColor" textTransform="uppercase">
              {t('Max')}
            </Text>
          </NumTicketsToBuyButton>
        )}
      </ShortcutButtonsWrapper>
      <Flex flexDirection="column">
        <Flex mb="8px" justifyContent="space-between">
          <Text color="textSubtle" fontSize="14px">
            {t('Cost')} {symbol}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {ticketPrice && getFullDisplayBalance(ticketPrice.times(ticketsToBuy || 0))} {symbol}
          </Text>
        </Flex>
        <Flex mb="8px" justifyContent="space-between">
          <Flex>
            <Text display="inline" bold fontSize="14px" mr="4px">
              {discountValue && totalCost ? discountPct : 0}%
            </Text>
            <Text display="inline" color="textSubtle" fontSize="14px">
              {t('Bulk discount')}
            </Text>
            <Flex alignItems="center" justifyContent="center" ref={targetRef}>
              <HelpIcon ml="4px" width="14px" height="14px" color="textSubtle" />
            </Flex>
          </Flex>
          <Text fontSize="14px" color="textSubtle">
            ~{discountValue} {symbol}
          </Text>
        </Flex>
        <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} pt="8px" mb="24px" justifyContent="space-between">
          <Text color="textSubtle" fontSize="16px">
            {t('You pay')}
          </Text>
          <Text fontSize="16px" bold>
            ~{totalCost} {symbol}
          </Text>
        </Flex>

        {account ? (
          <>
            <Button onClick={handleConfirm} disabled={disableBuying}>
              {t('Buy Instantly')}
            </Button>
            <Button
              variant="secondary"
              mt="8px"
              endIcon={
                <ArrowForwardIcon ml="2px" color={disableBuying ? 'disabled' : 'primary'} height="24px" width="24px" />
              }
              disabled={disableBuying}
              onClick={() => {
                setBuyingStage(BuyingStage.EDIT)
              }}
            >
              {t('View/Edit Numbers')}
            </Button>
          </>
        ) : (
          <ConnectWalletButton />
        )}

        <Text mt="24px" fontSize="12px" color="textSubtle">
          {t(
            '"Buy Instantly" chooses random numbers, with no duplicates among your tickets. Prices are set before each round starts, equal to $5 at that time. Purchases are final.',
          )}
        </Text>
      </Flex>
    </StyledModal>
  )
}

export default BuyTicketsModal
