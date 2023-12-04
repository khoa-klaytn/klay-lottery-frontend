import { WalletModalV2 } from '@sweepstakes/ui-wallets'
import { Button, ButtonProps } from '@sweepstakes/uikit'
import { createWallets } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useMemo, useState } from 'react'
import { useConnect } from 'wagmi'
import { logGTMWalletConnectEvent } from 'utils/customGTMEventTracking'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { login } = useAuth()
  const { connectAsync } = useConnect()
  const { chainId } = useActiveChainId()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync])

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children || <Trans>Connect Wallet</Trans>}
      </Button>
      <style jsx global>{`
        w3m-modal {
          position: relative;
          z-index: 99;
        }
      `}</style>
      <WalletModalV2
        isOpen={open}
        wallets={wallets}
        login={login}
        onDismiss={() => setOpen(false)}
        onWalletConnectCallBack={logGTMWalletConnectEvent}
      />
    </>
  )
}

export default ConnectWalletButton
