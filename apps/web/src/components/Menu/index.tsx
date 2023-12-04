import { languageList, useTranslation } from '@sweepstakes/localization'
import { footerLinks, Menu as UikitMenu, NextLinkFromReactRouter } from '@sweepstakes/uikit'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import { useKlayPrice } from 'hooks/useKlayPrice'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePhishingBanner } from '@sweepstakes/utils/user'
import { BIG_ZERO } from '@sweepstakes/utils/bigNumber'
import { useBuyKlay } from 'hooks/useBuyKlay'
import GlobalSettings from './GlobalSettings'
import { SettingsMode } from './GlobalSettings/types'
import { useMenuItems } from './hooks/useMenuItems'
import UserMenu from './UserMenu'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const LinkComponent = (linkProps) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const Menu = (props) => {
  const { chainId } = useActiveChainId()
  const { label, link } = useBuyKlay()
  const { isDark, setTheme } = useTheme()
  const klayPrice = useKlayPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const [showPhishingWarningBanner] = usePhishingBanner()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <>
      <UikitMenu
        linkComponent={LinkComponent}
        rightSide={
          <>
            <GlobalSettings mode={SettingsMode.GLOBAL} />
            <NetworkSwitcher />
            <UserMenu />
          </>
        }
        chainId={chainId}
        banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        klayPriceUsd={klayPrice.eq(BIG_ZERO) ? undefined : klayPrice}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyKlayLabel={label}
        buyKlayLink={link}
        {...props}
      />
    </>
  )
}

export default Menu
