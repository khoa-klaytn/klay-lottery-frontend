import { useKlayLotteryContract } from 'hooks/useContract'

export function Admin({ disabled }: { disabled: boolean }) {
  const lotteryContract = useKlayLotteryContract()

  function startLottery() {
    lotteryContract.write.startLottery()
  }

  return (
    <form>
      <button type="submit" disabled={disabled}>
        Start Lottery
      </button>
    </form>
  )
}
