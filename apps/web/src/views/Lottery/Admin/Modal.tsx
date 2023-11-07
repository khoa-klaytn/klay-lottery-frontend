import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useSSLotteryContract } from 'hooks/useContract'
import { useLottery } from 'state/lottery/hooks'
import { styled } from 'styled-components'
import { Button } from '@sweepstakes/uikit'
import InjectFunds from './InjectFunds'
import Operator from './Operator'
import Owner from './Owner'

const Container = styled('div')`
  position: fixed;
  top: 0;
  left: 25%;
  right: 25%;
  top: 2rem;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`

const CloseBtn = styled(Button)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  display: block;
`

export default function Modal({ isOperator, isOwner, isInjector, hideModal }) {
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useSSLotteryContract()
  const {
    currentRound: { lotteryId, status },
  } = useLottery()

  return (
    <Container>
      {isOperator && (
        <Operator
          callWithGasPrice={callWithGasPrice}
          lotteryContract={lotteryContract}
          lotteryId={lotteryId}
          status={status}
        />
      )}
      {isOwner && <Owner callWithGasPrice={callWithGasPrice} lotteryContract={lotteryContract} />}
      {isInjector && (
        <InjectFunds callWithGasPrice={callWithGasPrice} lotteryContract={lotteryContract} status={status} />
      )}
      <CloseBtn onClick={hideModal}>Close</CloseBtn>
    </Container>
  )
}
