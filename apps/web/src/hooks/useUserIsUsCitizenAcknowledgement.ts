/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false)
const affiliateProgram = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-affiliate-program', false)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    case IdType.AFFILIATE_PROGRAM:
      return useAtom(affiliateProgram)
    default:
      return useAtom(perpetuals)
  }
}
