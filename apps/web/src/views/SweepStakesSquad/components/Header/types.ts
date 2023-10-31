import { EventInfos, UserInfos, UserStatusEnum } from 'views/SweepStakesSquad/types'
import { Address } from 'wagmi'

export type SweepStakesSquadHeaderType = {
  account: Address
  isLoading: boolean
  eventInfos?: EventInfos
  userInfos?: UserInfos
  userStatus: UserStatusEnum
}

export enum ButtonsEnum {
  ACTIVATE,
  BUY,
  MINT,
  END,
  NONE,
}
