import { useTranslation } from '@pancakeswap/localization'
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
} from '@pancakeswap/uikit'
import { useAccount, usePublicClient } from 'wagmi'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { useCakePrice } from 'hooks/useCakePrice'
import { fetchUserTicketsAndLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { BaseError, parseEther } from 'viem'
import { styled } from 'styled-components'
import { BIG_ZERO, BIG_ONE_HUNDRED } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SHORT_SYMBOL } from 'config/chains'
import { klayLotteryABI } from 'config/abi/klayLottery'
import { handleCustomError } from 'utils/viem'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
import EditNumbersModal from './EditNumbersModal'
import NumTicketsToBuyButton from './NumTicketsToBuyButton'
import { useTicketsReducer } from './useTicketsReducer'

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
      priceTicket,
      discountDivisor,
      userTickets: { tickets: userCurrentTickets },
    },
  } = useLottery()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [ticketsToBuy, setTicketsToBuy] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [ticketCostBeforeDiscount, setTicketCostBeforeDiscount] = useState('')
  const [buyingStage, setBuyingStage] = useState<BuyingStage>(BuyingStage.BUY)
  const [maxPossibleTicketPurchase, setMaxPossibleTicketPurchase] = useState(BIG_ZERO)
  const [maxTicketPurchaseExceeded, setMaxTicketPurchaseExceeded] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const lotteryContract = useKlayLotteryContract()
  const { toastSuccess, toastError } = useToast()
  const [balance, setBalance] = useState(0n)
  const bnBalance = useMemo(() => new BigNumber(balance.toString()), [balance])
  const cakePriceBusd = useCakePrice()
  const dispatch = useAppDispatch()
  const displayBalance = getFullDisplayBalance(bnBalance, 18, 3)

  const TooltipComponent = () => (
    <>
      <Text mb="16px">
        {t(
          'Buying multiple tickets in a single transaction gives a discount. The discount increases in a linear way, up to the maximum of 100 tickets:',
        )}
      </Text>
      <Text>{t('2 tickets: 0.05%')}</Text>
      <Text>{t('50 tickets: 2.45%')}</Text>
      <Text>{t('100 tickets: 4.95%')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  const limitNumberByMaxTicketsPerBuy = useCallback(
    (number: BigNumber) => {
      return number.gt(maxNumberTicketsPerBuyOrClaim) ? maxNumberTicketsPerBuyOrClaim : number
    },
    [maxNumberTicketsPerBuyOrClaim],
  )

  const getTicketCostAfterDiscount = useCallback(
    (numberTickets: BigNumber) => {
      const totalAfterDiscount = priceTicket
        .times(numberTickets)
        .times(discountDivisor.plus(1).minus(numberTickets))
        .div(discountDivisor)
      return totalAfterDiscount
    },
    [discountDivisor, priceTicket],
  )

  const getMaxTicketBuyWithDiscount = useCallback(
    (numberTickets: BigNumber) => {
      const costAfterDiscount = getTicketCostAfterDiscount(numberTickets)
      const costBeforeDiscount = priceTicket.times(numberTickets)
      const discountAmount = costBeforeDiscount.minus(costAfterDiscount)
      const ticketsBoughtWithDiscount = discountAmount.div(priceTicket)
      const overallTicketBuy = numberTickets.plus(ticketsBoughtWithDiscount)
      return { overallTicketBuy, ticketsBoughtWithDiscount }
    },
    [getTicketCostAfterDiscount, priceTicket],
  )

  const validateInput = useCallback(
    (inputNumber: BigNumber) => {
      const limitedNumberTickets = limitNumberByMaxTicketsPerBuy(inputNumber)
      const costAfterDiscount = getTicketCostAfterDiscount(limitedNumberTickets)

      if (costAfterDiscount.gt(bnBalance)) {
        setInsufficientBalance(true)
      } else if (limitedNumberTickets.eq(maxNumberTicketsPerBuyOrClaim)) {
        setMaxTicketPurchaseExceeded(true)
      } else {
        setInsufficientBalance(false)
        setMaxTicketPurchaseExceeded(false)
      }
    },
    [bnBalance, limitNumberByMaxTicketsPerBuy, getTicketCostAfterDiscount, maxNumberTicketsPerBuyOrClaim],
  )

  useEffect(() => {
    const getBalance = async () => {
      const newBalance = await publicClient.getBalance({ address: account })
      setBalance(newBalance)
    }
    if (account) {
      getBalance()
    }
  }, [account, publicClient])

  useEffect(() => {
    const getMaxPossiblePurchase = () => {
      const maxBalancePurchase = bnBalance.div(priceTicket)
      const limitedMaxPurchase = limitNumberByMaxTicketsPerBuy(maxBalancePurchase)
      let maxPurchase = limitedMaxPurchase

      // If the users' max balance purchase is less than the contract limit - factor the discount logic into the max number of tickets they can purchase
      if (limitedMaxPurchase.lt(maxNumberTicketsPerBuyOrClaim)) {
        // Get max tickets purchasable with the users' balance, as well as using the discount to buy tickets
        const { overallTicketBuy: maxPlusDiscountTickets } = getMaxTicketBuyWithDiscount(limitedMaxPurchase)

        // Knowing how many tickets they can buy when counting the discount - plug that total in, and see how much that total will get discounted
        const { ticketsBoughtWithDiscount: secondTicketDiscountBuy } =
          getMaxTicketBuyWithDiscount(maxPlusDiscountTickets)

        // Add the additional tickets that can be bought with the discount, to the original max purchase
        maxPurchase = limitedMaxPurchase.plus(secondTicketDiscountBuy)
      }

      if (maxPurchase.lt(1)) {
        setInsufficientBalance(true)
      } else {
        setInsufficientBalance(false)
      }

      setMaxPossibleTicketPurchase(maxPurchase)
    }
    getMaxPossiblePurchase()
  }, [
    bnBalance,
    maxNumberTicketsPerBuyOrClaim,
    priceTicket,
    limitNumberByMaxTicketsPerBuy,
    getTicketCostAfterDiscount,
    getMaxTicketBuyWithDiscount,
  ])

  useEffect(() => {
    const numberOfTicketsToBuy = new BigNumber(ticketsToBuy)
    const costAfterDiscount = getTicketCostAfterDiscount(numberOfTicketsToBuy)
    const costBeforeDiscount = priceTicket.times(numberOfTicketsToBuy)
    const discountBeingApplied = costBeforeDiscount.minus(costAfterDiscount)
    setTicketCostBeforeDiscount(costBeforeDiscount.gt(0) ? getFullDisplayBalance(costBeforeDiscount) : '0')
    setTotalCost(costAfterDiscount.gt(0) ? getFullDisplayBalance(costAfterDiscount) : '0')
    setDiscountValue(discountBeingApplied.gt(0) ? getFullDisplayBalance(discountBeingApplied, 18, 5) : '0')
  }, [ticketsToBuy, priceTicket, discountDivisor, getTicketCostAfterDiscount])

  const getNumTicketsByPercentage = (percentage: number): number => {
    const percentageOfMaxTickets = maxPossibleTicketPurchase.gt(0)
      ? maxPossibleTicketPurchase.div(BIG_ONE_HUNDRED).times(new BigNumber(percentage))
      : BIG_ZERO
    return Math.floor(percentageOfMaxTickets.toNumber())
  }

  const tenPercentOfBalance = getNumTicketsByPercentage(10)
  const twentyFivePercentOfBalance = getNumTicketsByPercentage(25)
  const fiftyPercentOfBalance = getNumTicketsByPercentage(50)
  const oneHundredPercentOfBalance = getNumTicketsByPercentage(100)

  const handleInputChange = (input: string) => {
    // Force input to integer
    const inputAsInt = parseInt(input, 10)
    const inputAsBN = new BigNumber(inputAsInt)
    const limitedNumberTickets = limitNumberByMaxTicketsPerBuy(inputAsBN)
    validateInput(inputAsBN)
    setTicketsToBuy(inputAsInt ? limitedNumberTickets.toString() : '')
  }

  const handleNumberButtonClick = (number: number) => {
    setTicketsToBuy(number.toFixed())
    setInsufficientBalance(false)
    setMaxTicketPurchaseExceeded(false)
  }

  const [updateTicket, randomize, tickets, allComplete, getTicketsForPurchase] = useTicketsReducer(
    parseInt(ticketsToBuy, 10),
    userCurrentTickets,
  )

  const { isConfirming, handleConfirm } = useApproveConfirmTransaction({
    spender: lotteryContract.address,
    minAmount: parseEther(totalCost as `${number}`),
    onConfirm: async () => {
      const ticketsForPurchase = getTicketsForPurchase()
      const value = await publicClient.readContract({
        abi: klayLotteryABI,
        address: lotteryContract.address,
        functionName: 'calculateCurrentTotalPriceForBulkTickets',
        args: [BigInt(ticketsForPurchase.length)],
      })
      let res
      try {
        res = callWithGasPrice(lotteryContract, 'buyTickets', [BigInt(currentLotteryId), ticketsForPurchase], { value })
        console.log(res)
      } catch (e) {
        console.error(e)
        if (e instanceof BaseError) {
          handleCustomError(e, {
            LotteryNotOpen: (_, msg) => toastError(msg),
            InsufficientFunds: (_, msg) => toastError(msg),
            TicketNumberInvalid: (_, msg) => toastError(msg),
          })
        }
      }
      return res
    },
    onSuccess: async ({ receipt }) => {
      onDismiss?.()
      dispatch(fetchUserTicketsAndLotteries({ publicClient, lotteryAddress, account, currentLotteryId }))
      toastSuccess(t('Lottery tickets purchased!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
  })

  const getErrorMessage = () => {
    if (insufficientBalance) return t('Insufficient balance')
    return t('The maximum number of tickets you can buy in one transaction is %maxTickets%', {
      maxTickets: maxNumberTicketsPerBuyOrClaim.toString(),
    })
  }

  const percentageDiscount = () => {
    const percentageAsBn = new BigNumber(discountValue).div(new BigNumber(ticketCostBeforeDiscount)).times(100)
    if (percentageAsBn.isNaN() || percentageAsBn.eq(0)) {
      return 0
    }
    return percentageAsBn.toNumber().toFixed(2)
  }

  const disableBuying = useMemo(
    () =>
      isConfirming ||
      insufficientBalance ||
      !ticketsToBuy ||
      new BigNumber(ticketsToBuy).lte(0) ||
      getTicketsForPurchase().length !== parseInt(ticketsToBuy, 10),
    [isConfirming, insufficientBalance, ticketsToBuy, getTicketsForPurchase],
  )

  if (buyingStage === BuyingStage.EDIT) {
    return (
      <EditNumbersModal
        totalCost={totalCost}
        updateTicket={updateTicket}
        randomize={randomize}
        tickets={tickets}
        allComplete={allComplete}
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
        isWarning={account && (insufficientBalance || maxTicketPurchaseExceeded)}
        placeholder="0"
        value={ticketsToBuy}
        onUserInput={handleInputChange}
        currencyValue={
          cakePriceBusd.gt(0) &&
          `~${ticketsToBuy ? getFullDisplayBalance(priceTicket.times(new BigNumber(ticketsToBuy))) : '0.00'} ${symbol}`
        }
      />
      <Flex alignItems="center" justifyContent="flex-end" mt="4px" mb="12px">
        <Flex justifyContent="flex-end" flexDirection="column">
          {account && (insufficientBalance || maxTicketPurchaseExceeded) && (
            <Text fontSize="12px" color="failure">
              {getErrorMessage()}
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

      <ShortcutButtonsWrapper isVisible={account && oneHundredPercentOfBalance >= 1}>
        {tenPercentOfBalance >= 1 && (
          <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(tenPercentOfBalance)}>
            {tenPercentOfBalance}
          </NumTicketsToBuyButton>
        )}
        {twentyFivePercentOfBalance >= 1 && (
          <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(twentyFivePercentOfBalance)}>
            {twentyFivePercentOfBalance}
          </NumTicketsToBuyButton>
        )}
        {fiftyPercentOfBalance >= 1 && (
          <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(fiftyPercentOfBalance)}>
            {fiftyPercentOfBalance}
          </NumTicketsToBuyButton>
        )}
        {oneHundredPercentOfBalance >= 1 && (
          <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(oneHundredPercentOfBalance)}>
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
            {priceTicket && getFullDisplayBalance(priceTicket.times(ticketsToBuy || 0))} {symbol}
          </Text>
        </Flex>
        <Flex mb="8px" justifyContent="space-between">
          <Flex>
            <Text display="inline" bold fontSize="14px" mr="4px">
              {discountValue && totalCost ? percentageDiscount() : 0}%
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
            <Button onClick={handleConfirm}>Buy Instantly</Button>
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
