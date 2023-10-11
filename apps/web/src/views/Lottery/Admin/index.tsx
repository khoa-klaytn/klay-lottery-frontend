import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import { useLottery } from 'state/lottery/hooks'
import { StartLottery } from './StartLottery'
import { CloseLottery } from './CloseLottery'
import { MakeLotteryClaimable } from './MakeLotteryClaimable'
import { Reset } from './Reset'

export function Admin() {
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useKlayLotteryContract()
  const {
    currentRound: { lotteryId, status },
  } = useLottery()

  return (
    <>
      <StartLottery lotteryId={lotteryId} status={status} />
      <CloseLottery
        callWithGasPrice={callWithGasPrice}
        lotteryContract={lotteryContract}
        lotteryId={lotteryId}
        status={status}
      />
      <MakeLotteryClaimable
        callWithGasPrice={callWithGasPrice}
        lotteryContract={lotteryContract}
        lotteryId={lotteryId}
        status={status}
      />
      <Reset callWithGasPrice={callWithGasPrice} lotteryContract={lotteryContract} />
    </>
  )
}
