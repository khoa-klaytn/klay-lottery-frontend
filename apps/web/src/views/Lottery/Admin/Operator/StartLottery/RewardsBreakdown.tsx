import { Input } from '@sweepstakes/uikit'
import { useImperativeHandle, ChangeEvent, ForwardedRef, useState, forwardRef, useMemo } from 'react'
import { EMsg } from '../../EMsg'

interface RewardsBreakdownProps {
  value: string[]
  setRewardsBreakdown: (cb: (value: string[]) => string[]) => void
}

export type RewardsBreakdownRef = { setEMsg: (msg: string) => void }

function RewardsBreakdown(
  { value, setRewardsBreakdown }: RewardsBreakdownProps,
  forwardedRef: ForwardedRef<RewardsBreakdownRef>,
) {
  const [eMsg, setEMsg] = useState('') // [rewards] error message

  const elArr = useMemo(() => {
    const { length } = value
    const arr = new Array(length)
    for (let i = length; i--; ) {
      const v = value[i]
      arr[i] = (
        <label key={i}>
          {i + 1}
          <Input
            type="number"
            value={v}
            onInput={(ev: ChangeEvent<HTMLInputElement>) => {
              const { value: evTargetV } = ev.currentTarget
              setEMsg('')
              setRewardsBreakdown((prev) => {
                const newValue = [...prev]
                newValue[i] = evTargetV
                return newValue
              })
            }}
          />
        </label>
      )
    }
    return arr
  }, [value, setRewardsBreakdown])

  useImperativeHandle(forwardedRef, () => ({
    setEMsg,
  }))

  return (
    <fieldset>
      <header>Reward Portions</header>
      {eMsg && <EMsg>{eMsg}</EMsg>}
      {elArr}
    </fieldset>
  )
}

export default forwardRef(RewardsBreakdown)
