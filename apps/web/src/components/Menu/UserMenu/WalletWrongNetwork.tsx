import { styled } from 'styled-components'
import { useTranslation } from '@sweepstakes/localization'
import { Button, Text, Link, HelpIcon, Message, MessageText } from '@sweepstakes/uikit'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<React.PropsWithChildren<WalletWrongNetworkProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const { switchNetworkAsync, canSwitch } = useSwitchNetwork()

  const handleSwitchNetwork = useCallback(async (): Promise<void> => {
    switchNetworkAsync(chainId)
    onDismiss?.()
  }, [chainId, onDismiss, switchNetworkAsync])

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      {canSwitch ? (
        <Button onClick={handleSwitchNetwork} mb="24px">
          {t('Switch Network')}
        </Button>
      ) : (
        <Message variant="danger">
          <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
        </Message>
      )}
      <StyledLink href="https://docs.sweepstakes.finance/get-started/connection-guide" external>
        <Button width="100%" variant="secondary">
          {t('Learn How')}
          <HelpIcon color="primary" ml="6px" />
        </Button>
      </StyledLink>
    </>
  )
}

export default WalletWrongNetwork
