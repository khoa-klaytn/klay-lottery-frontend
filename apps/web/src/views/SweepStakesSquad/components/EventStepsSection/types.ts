import { ContextApi } from '@sweepstakes/localization'
import { DefaultTheme } from 'styled-components'
import { UserInfos, EventInfos, UserStatusEnum } from 'views/SweepStakesSquad/types'
import { Address } from 'wagmi'

export type EventStepsProps = {
  eventInfos?: EventInfos
  userInfos?: UserInfos
  isLoading: boolean
  userStatus: UserStatusEnum
  account: Address
}

export type EventStepsType = { t: ContextApi['t']; theme: DefaultTheme; cakeBalance: bigint } & Pick<
  EventStepsProps,
  'eventInfos' | 'userInfos' | 'userStatus' | 'account'
>
