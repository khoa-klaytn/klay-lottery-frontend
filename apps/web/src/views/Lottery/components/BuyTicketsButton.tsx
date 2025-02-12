import { Button, useModal, WaitIcon, ButtonProps } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { useLottery } from 'state/lottery/hooks'
import { useTheme } from '@sweepstakes/hooks'
import { LotteryStatus } from 'config/constants/types'
import BuyTicketsModal from './BuyTicketsModal/BuyTicketsModal'

interface BuyTicketsButtonProps extends ButtonProps {
  disabled?: boolean
  themeMode?: string
}

const BuyTicketsButton: React.FC<React.PropsWithChildren<BuyTicketsButtonProps>> = ({
  disabled,
  themeMode,
  ...props
}) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const {
    currentLotteryId,
    maxNumberTicketsPerBuyOrClaim,
    currentRound: { status },
  } = useLottery()

  const getBuyButtonText = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Buy Tickets')
    }
    return (
      <>
        <WaitIcon mr="4px" color="textDisabled" /> {t('On sale soon!')}
      </>
    )
  }

  const themeStr = themeMode ?? (isDark ? 'dark' : 'light')

  return (
    <Button
      data-theme={themeStr}
      {...props}
      disabled={disabled || !currentLotteryId || maxNumberTicketsPerBuyOrClaim.isNaN()}
      onClick={onPresentBuyTicketsModal}
    >
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
