import { useTheme } from '@sweepstakes/hooks'
import { useMatchBreakpoints } from '@sweepstakes/uikit'
import { useTranslation } from '@sweepstakes/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import config, { ConfigMenuItemsType } from '../config/config'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const menuItems = useMemo(() => {
    if (isMobile) {
      const mobileConfig = [...config(t, isDark, languageCode, chainId)]
      return mobileConfig
    }
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId, isMobile])

  return menuItems
}
