import { atom, useAtom } from 'jotai'
// import differenceInDays from 'date-fns/differenceInDays'
import { atomWithStorage } from 'jotai/utils'

const phishingBannerAtom = atomWithStorage<number>('pcs:phishing-banner', 0)

const showPhishingBannerAtom = atom(
  (/* get */) => {
    // const now = Date.now()
    // const last = get(phishingBannerAtom)
    // const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
    // return last ? differenceInDays(now, last) >= 1 && notPreview : notPreview
    return false // TODO: uncomment once deployed on Klaytn Mainnet
  },
  (_, set) => set(phishingBannerAtom, Date.now()),
)

export function usePhishingBanner() {
  return useAtom(showPhishingBannerAtom)
}
