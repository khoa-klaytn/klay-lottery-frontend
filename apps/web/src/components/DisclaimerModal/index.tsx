import { useState, useCallback, ReactNode } from 'react'
import {
  ModalContainer,
  ModalBody,
  Text,
  Button,
  Flex,
  InjectedModalProps,
  Checkbox,
  ModalHeader,
  ModalTitle,
  Heading,
  Box,
} from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { styled } from 'styled-components'

export interface CheckType {
  key: string
  value?: boolean
  content: string
}

interface RiskDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
  checks: CheckType[]
  header: ReactNode
  modalHeader?: string
  id: string
  footer?: ReactNode
  subtitle?: ReactNode
  hideConfirm?: boolean
  headerStyle?: React.CSSProperties
  footerStyle?: React.CSSProperties
}

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

const DisclaimerModal: React.FC<React.PropsWithChildren<RiskDisclaimerProps>> = ({
  id,
  onSuccess,
  onDismiss,
  checks,
  header,
  subtitle,
  hideConfirm,
  modalHeader,
  footer,
  headerStyle,
  footerStyle,
}) => {
  const [checkState, setCheckState] = useState(checks || [])
  const { t } = useTranslation()

  const handleSetAcknowledgeRisk = useCallback(
    (currentKey) => {
      const newCheckState = checkState.map((check) => {
        if (currentKey === check.key) {
          return { ...check, value: !check.value }
        }

        return check
      })

      setCheckState(newCheckState)
    },
    [checkState],
  )

  const handleConfirm = useCallback(() => {
    onSuccess()
    onDismiss?.()
  }, [onSuccess, onDismiss])

  return (
    <ModalContainer title={modalHeader || t('Welcome!')} style={{ minWidth: '320px' }} id={id}>
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{modalHeader || t('Welcome!')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth={['100%', '100%', '100%', '400px']}>
        <Box maxHeight="300px" overflowY="auto">
          <Heading as="h3" mb="24px" style={headerStyle}>
            {header}
          </Heading>
          {subtitle && (
            <Text as="p" color="textSubtle" mb="24px">
              {subtitle}
            </Text>
          )}
          {checkState.map((check) => (
            <label
              key={check.key}
              htmlFor={check.key}
              style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}
            >
              <Flex alignItems="center">
                <div style={{ flex: 'none', alignSelf: 'flex-start', paddingTop: '8px' }}>
                  <Checkbox
                    id={check.key}
                    scale="sm"
                    checked={check.value}
                    onChange={() => handleSetAcknowledgeRisk(check.key)}
                  />
                </div>
                <Text ml="8px">{check.content}</Text>
              </Flex>
            </label>
          ))}
        </Box>
        {footer && (
          <Heading as="h3" mb="24px" style={footerStyle}>
            {footer}
          </Heading>
        )}
        {!hideConfirm && (
          <Button
            id={`${id}-continue`}
            width="100%"
            onClick={handleConfirm}
            disabled={checkState.some((check) => !check.value)}
          >
            {t('Continue')}
          </Button>
        )}
      </ModalBody>
    </ModalContainer>
  )
}

export default DisclaimerModal
