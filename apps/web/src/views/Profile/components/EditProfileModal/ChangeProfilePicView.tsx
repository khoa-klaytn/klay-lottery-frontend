import { useTranslation } from '@sweepstakes/localization'
import { Button, InjectedModalProps, Text, useToast } from '@sweepstakes/uikit'
import { useWalletClient } from 'wagmi'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useProfileContract } from 'hooks/useContract'
import { useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { getSweepStakesProfileAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'

interface ChangeProfilePicPageProps extends InjectedModalProps {
  onSuccess?: () => void
}

const ChangeProfilePicPage: React.FC<React.PropsWithChildren<ChangeProfilePicPageProps>> = ({
  onDismiss,
  onSuccess,
}) => {
  const [selectedNft] = useState({
    tokenId: null,
    collectionAddress: null,
  })
  const { t } = useTranslation()
  const { data: signer } = useWalletClient()
  const { profile, refresh: refreshProfile } = useProfile()
  const profileContract = useProfileContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        if (!selectedNft.tokenId) return true
        const contract = getErc721Contract(selectedNft.collectionAddress, signer)
        const approvedAddress = await contract.read.getApproved([selectedNft.tokenId])
        return approvedAddress !== getSweepStakesProfileAddress()
      },
      onApprove: () => {
        const contract = getErc721Contract(selectedNft.collectionAddress, signer)

        return callWithGasPrice(contract, 'approve', [getSweepStakesProfileAddress(), selectedNft.tokenId])
      },
      onConfirm: () => {
        if (!profile.isActive) {
          return callWithGasPrice(profileContract, 'reactivateProfile', [
            selectedNft.collectionAddress,
            selectedNft.tokenId,
          ])
        }

        return callWithGasPrice(profileContract, 'updateProfile', [selectedNft.collectionAddress, selectedNft.tokenId])
      },
      onSuccess: async ({ receipt }) => {
        // Re-fetch profile
        refreshProfile()
        toastSuccess(t('Profile Updated!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        onSuccess?.()
        onDismiss?.()
      },
    })

  const alreadyApproved = isApproved

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new Collectible to use as your profile pic.')}
      </Text>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || alreadyApproved || selectedNft.tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!alreadyApproved || isConfirmed || selectedNft.tokenId === null}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
      <Button mt="8px" variant="text" width="100%" onClick={onDismiss} disabled={isApproving || isConfirming}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
