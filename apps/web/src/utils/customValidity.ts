import type { RefObject } from 'react'

export type HasSetCustomValidity = Pick<HTMLInputElement, 'setCustomValidity'>

export type HasValidity = Pick<HTMLInputElement, 'reportValidity'> & HasSetCustomValidity

export function setRefCustomValidity<T extends HasValidity>(ref: RefObject<T>, msg: string) {
  if (ref.current) {
    ref.current.setCustomValidity(msg)
    ref.current.reportValidity()
  }
}
