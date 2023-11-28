import { useTranslation } from '@sweepstakes/localization'
import { Flex, Modal, Text, useToast } from '@sweepstakes/uikit'
import ConfirmButtons from 'components/ConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import { formatUnits } from 'viem'
import useConfirmTransaction from 'hooks/useConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useProfileContract } from 'hooks/useContract'
import { useProfile } from 'state/profile/hooks'
import { REGISTER_COST } from './config'
import { State } from './contexts/types'

interface Props {
  userName: string
  selectedNft: State['selectedNft']
  teamId: number
  allowance: bigint
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<React.PropsWithChildren<Props>> = ({ teamId, selectedNft, onDismiss }) => {
  const { t } = useTranslation()
  const profileContract = useProfileContract()
  const { refresh: refreshProfile } = useProfile()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isConfirmed, isConfirming, handleConfirm } = useConfirmTransaction({
    onConfirm: () => {
      return callWithGasPrice(profileContract, 'createProfile', [
        BigInt(teamId),
        selectedNft.collectionAddress,
        BigInt(selectedNft.tokenId),
      ])
    },
    onSuccess: async ({ receipt }) => {
      refreshProfile()
      onDismiss()
      toastSuccess(t('Profile created!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
  })

  return (
    <Modal title={t('Complete Profile')} onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t('%num% KLAY', { num: formatUnits(REGISTER_COST, 18) })}</Text>
      </Flex>
      <ConfirmButtons isConfirmDisabled={isConfirmed} isConfirming={isConfirming} onConfirm={handleConfirm} />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
