import { useTranslation } from '@sweepstakes/localization'
import { useIsBaobab } from './useIsBaobab'

export function useBuyKlay() {
  const isBaobab = useIsBaobab()
  const { t } = useTranslation()
  if (isBaobab) {
    return {
      label: t('Testnet KLAY Faucet'),
      link: 'https://baobab.wallet.klaytn.foundation/faucet',
    }
  }
  return {
    label: t('Buy KLAY'),
    link: 'https://ramp.alchemypay.org/?crypto=KLAY&fiat=USD&amount=299&alpha2=US&network=KLAY&type=officialWebsite#/index',
  }
}
