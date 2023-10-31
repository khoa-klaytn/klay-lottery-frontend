import { getNetwork, watchNetwork } from '@sweepstakes/awgmi/core'
import { useSyncExternalStoreWithTracked } from './useSyncExternalStoreWithTracked'

export function useNetwork() {
  return useSyncExternalStoreWithTracked(watchNetwork, getNetwork)
}
