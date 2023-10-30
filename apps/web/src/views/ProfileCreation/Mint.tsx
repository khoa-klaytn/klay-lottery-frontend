import { useTranslation } from '@pancakeswap/localization'
import { Card, CardBody, Heading, Text, useToast } from '@pancakeswap/uikit'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { FetchStatus } from 'config/constants/types'
import { formatUnits } from 'viem'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useBunnyFactory } from 'hooks/useContract'
import { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { useState } from 'react'
import { getBunnyFactoryAddress } from 'utils/addressHelpers'
import { bscTokens } from '@pancakeswap/tokens'
import { MINT_COST } from './config'
import useProfileCreation from './contexts/hook'
import NextStepButton from './NextStepButton'

const Mint: React.FC<React.PropsWithChildren> = () => {
  const [selectedBunnyId] = useState<string>('')
  const { actions, allowance } = useProfileCreation()
  const { toastSuccess } = useToast()

  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
  const { balance: cakeBalance, fetchStatus } = useBSCCakeBalance()
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.Fetched && cakeBalance >= MINT_COST
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      token: bscTokens.cake,
      spender: getBunnyFactoryAddress(),
      minAmount: MINT_COST,
      targetAmount: allowance,
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [BigInt(selectedBunnyId)])
      },
      onApproveSuccess: () => {
        toastSuccess(t('Enabled'), t("Press 'confirm' to mint this NFT"))
      },
      onSuccess: () => {
        toastSuccess(t('Success'), t('You have minted your starter NFT'))
        actions.nextStep()
      },
    })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Get Starter Collectible')}
      </Heading>
      <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{t('This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {t('Cost: %num% KLAY', { num: formatUnits(MINT_COST, 18) })}
          </Text>
          {!hasMinimumCakeRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% KLAY is required', { num: formatUnits(MINT_COST, 18) })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={selectedBunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumCakeRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
