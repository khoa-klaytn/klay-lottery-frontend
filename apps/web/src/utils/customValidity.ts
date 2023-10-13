import type { RefObject } from 'react'

export function setRefCustomValidity(ref: RefObject<HTMLInputElement>, msg: string) {
  if (ref.current) {
    ref.current.setCustomValidity(msg)
    ref.current.reportValidity()
  }
}
