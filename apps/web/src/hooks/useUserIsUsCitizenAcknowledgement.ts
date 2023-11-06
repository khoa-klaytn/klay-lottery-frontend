/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  PERPETUALS = 'perpetuals',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    default:
      return useAtom(perpetuals)
  }
}
