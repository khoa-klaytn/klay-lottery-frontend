import { styled } from 'styled-components'
import { Button as UIKitButton, AutoRenewIcon, Box } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'

export enum ButtonArrangement {
  ROW = 'row',
  SEQUENTIAL = 'sequential',
}

interface ConfirmButtonsProps {
  isConfirming: boolean
  isConfirmDisabled: boolean
  onConfirm: () => void
  buttonArrangement?: ButtonArrangement
  confirmLabel?: string
  confirmId?: string
  useMinWidth?: boolean
}

const StyledConfirmButtonRow = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 24px 1fr;
  }
`

const Button = styled(UIKitButton)<{ useMinWidth?: boolean }>`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ useMinWidth }) =>
      useMinWidth &&
      `
    min-width: 160px;
  `}
  }
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const ConfirmButtons: React.FC<React.PropsWithChildren<ConfirmButtonsProps>> = ({
  isConfirming,
  isConfirmDisabled,
  onConfirm,
  buttonArrangement = ButtonArrangement.ROW,
  confirmLabel,
  confirmId,
  useMinWidth = true,
}) => {
  const { t } = useTranslation()
  const confirmButtonText = confirmLabel ?? t('Confirm')

  const ConfirmRow = () => {
    return (
      <StyledConfirmButtonRow>
        <Box>
          <Button
            id={confirmId}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            isLoading={isConfirming}
            endIcon={isConfirming ? spinnerIcon : undefined}
            useMinWidth={useMinWidth}
          >
            {isConfirming ? t('Confirming') : confirmButtonText}
          </Button>
        </Box>
      </StyledConfirmButtonRow>
    )
  }

  const ConfirmSequential = () => {
    return (
      <Box>
        <Button
          id={confirmId}
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          isLoading={isConfirming}
          endIcon={isConfirming ? spinnerIcon : undefined}
        >
          {isConfirming ? t('Confirming') : confirmButtonText}
        </Button>
      </Box>
    )
  }

  return buttonArrangement === ButtonArrangement.ROW ? ConfirmRow() : ConfirmSequential()
}

export default ConfirmButtons
