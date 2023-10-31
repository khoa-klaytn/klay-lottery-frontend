import { Input } from '@sweepstakes/uikit'
import { useCallback, forwardRef, type ForwardedRef, useRef, useImperativeHandle, ChangeEvent } from 'react'
import { HasSetCustomValidity, setRefCustomValidity } from 'utils/customValidity'

interface EndTimeProps {
  value: string
  setEndTime: (value: string) => void
}

function EndTime({ value, setEndTime }: EndTimeProps, forwardedRef: ForwardedRef<HasSetCustomValidity>) {
  const ref = useRef<HTMLInputElement>(null)
  const onInput = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setRefCustomValidity(ref, '')
      setEndTime(ev.currentTarget.value)
    },
    [setEndTime, ref],
  )

  useImperativeHandle(forwardedRef, () => ({
    setCustomValidity(msg: string) {
      setRefCustomValidity(ref, msg)
    },
  }))

  return (
    <label>
      End Time
      <Input type="datetime-local" name="endTime" id="endTime" value={value} ref={ref} onInput={onInput} />
    </label>
  )
}

export default forwardRef(EndTime)
