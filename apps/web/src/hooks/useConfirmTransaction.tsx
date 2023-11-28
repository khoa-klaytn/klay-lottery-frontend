import noop from 'lodash/noop'
import { useCallback, useReducer } from 'react'
import { SendTransactionResult, WaitForTransactionResult } from 'wagmi/actions'
import useCatchTxError from './useCatchTxError'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action = { type: 'confirm_sending' } | { type: 'confirm_receipt' } | { type: 'confirm_error' }

interface State {
  confirmState: LoadingState
}

const initialState: State = {
  confirmState: 'idle',
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
    case 'confirm_sending':
      return {
        ...state,
        confirmState: 'loading',
      }
    case 'confirm_receipt':
      return {
        ...state,
        confirmState: 'success',
      }
    case 'confirm_error':
      return {
        ...state,
        confirmState: 'fail',
      }
    default:
      return state
  }
}

interface OnSuccessProps {
  state: State
  receipt: WaitForTransactionResult
}

type ConfirmTransaction = {
  onConfirm: (params?) => Promise<SendTransactionResult>
  onSuccess: ({ state, receipt }: OnSuccessProps) => void
}

const useConfirmTransaction = ({ onConfirm, onSuccess = noop }: ConfirmTransaction) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleConfirm = useCallback(
    async (params = {}) => {
      const receipt = await fetchWithCatchTxError(() => {
        dispatch({ type: 'confirm_sending' })
        return onConfirm(params)
      })
      if (receipt?.status) {
        dispatch({ type: 'confirm_receipt' })
        onSuccess({ state, receipt })
      } else {
        dispatch({ type: 'confirm_error' })
      }
    },
    [onConfirm, dispatch, onSuccess, state, fetchWithCatchTxError],
  )

  return {
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    hasConfirmFailed: state.confirmState === 'fail',
    handleConfirm,
  }
}

export default useConfirmTransaction
