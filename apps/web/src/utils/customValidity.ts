import type { RefObject } from 'react'

export function setRefCustomValidity(ref: RefObject<HTMLInputElement>, msg: string) {
  if (ref.current) {
    ref.current.setCustomValidity(msg)
    ref.current.reportValidity()
  }
}

export function setChildCustomValidity(el: HTMLFieldSetElement, msg: string) {
  el.querySelectorAll('input')[0].setCustomValidity(msg)
}

export function setRefChildCustomValidity(ref: RefObject<HTMLFieldSetElement>, msg: string) {
  if (ref.current) setChildCustomValidity(ref.current, msg)
}
