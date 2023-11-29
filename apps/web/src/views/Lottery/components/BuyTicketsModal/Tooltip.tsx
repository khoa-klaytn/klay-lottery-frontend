import { Text } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { useCallback, useMemo } from 'react'
import useCalcDiscountPct from 'views/Lottery/hooks/useDiscountPct'

export default function TooltipComponent() {
  const { t } = useTranslation()
  const calcDiscountPct = useCalcDiscountPct()

  const Saved = useCallback(
    (n: number) => {
      return <Text>{t(`${n} tickets: ${calcDiscountPct(n)}%`)}</Text>
    },
    [calcDiscountPct, t],
  )
  const { saved2, saved50, saved100 } = useMemo(() => {
    return {
      saved2: Saved(2),
      saved50: Saved(50),
      saved100: Saved(100),
    }
  }, [Saved])
  return (
    <>
      <Text mb="16px">
        {t(
          'Buying multiple tickets in a single transaction gives a discount. The discount increases in a linear way, up to the maximum of 100 tickets:',
        )}
      </Text>
      {saved2}
      {saved50}
      {saved100}
    </>
  )
}
