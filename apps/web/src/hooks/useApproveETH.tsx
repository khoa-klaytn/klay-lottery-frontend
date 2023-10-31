import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import type { Address } from 'viem'
import { useTokenContract } from 'hooks/useContract'
import { WETH9 } from '@sweepstakes/sdk'
import { useCallback } from 'react'
import { useToast } from '@sweepstakes/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@sweepstakes/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@sweepstakes/swap-sdk-core'
import { useActiveChainId } from './useActiveChainId'

export const useApproveETH = (spender: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { chainId } = useActiveChainId()

  const ethContract = useTokenContract(WETH9[chainId].address)

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(ethContract, 'approve', [spender as Address, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [spender, ethContract, t, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, onApprove }
}
