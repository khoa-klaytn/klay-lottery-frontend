import { useEffect } from 'react'
import { styled } from 'styled-components'
import { Heading, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalCloseButton } from '@sweepstakes/uikit'
import { useAccount, usePublicClient } from 'wagmi'
import { useTranslation } from '@sweepstakes/localization'
import delay from 'lodash/delay'
import confetti from 'canvas-confetti'
import { LotteryTicketClaimData } from 'config/constants/types'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserLotteries } from 'state/lottery'
import useLotteryAddress from 'views/Lottery/hooks/useLotteryAddress'
import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`

const showConfetti = () => {
  confetti({
    particleCount: 200,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.3,
    },
  })
}

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<React.PropsWithChildren<ClaimPrizesModalModalProps>> = ({
  onDismiss,
  roundsToClaim,
}) => {
  const publicClient = usePublicClient()
  const lotteryAddress = useLotteryAddress()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { currentLotteryId } = useLottery()
  const dispatch = useAppDispatch()

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <StyledModal minWidth="280px">
      <StyledModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </StyledModalHeader>
      <ModalBody p="24px">
        <ClaimPrizesInner
          onSuccess={() => {
            dispatch(fetchUserLotteries({ publicClient, lotteryAddress, account, currentLotteryId }))
            onDismiss?.()
          }}
          roundsToClaim={roundsToClaim}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default ClaimPrizesModal
