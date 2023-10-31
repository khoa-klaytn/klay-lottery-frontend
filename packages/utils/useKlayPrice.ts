import useSWRImmutable from 'swr/immutable'

export const useKlayPrice = () => {
  return useSWRImmutable(
    ['klay-usd-price'],
    async () => {
      const klay = await (
        await fetch('https://api.coingecko.com/api/v3/simple/price?ids=klay-token&vs_currencies=usd')
      ).json()
      return klay['klay-token'].usd as string
    },
    {
      refreshInterval: 1_000 * 10,
    },
  )
}
