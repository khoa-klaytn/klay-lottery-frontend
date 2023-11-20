import { Text } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'

export default function TooltipComponent() {
  const { t } = useTranslation()
  return (
    <>
      <Text mb="16px">
        {t(
          'Buying multiple tickets in a single transaction gives a discount. The discount increases in a linear way, up to the maximum of 100 tickets:',
        )}
      </Text>
      <Text>{t('2 tickets: 0.05%')}</Text>
      <Text>{t('50 tickets: 2.45%')}</Text>
      <Text>{t('100 tickets: 4.95%')}</Text>
    </>
  )
}
