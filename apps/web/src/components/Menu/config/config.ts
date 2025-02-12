import { ContextApi } from '@sweepstakes/localization'
import { /* DropdownMenuItemType, */ DropdownMenuItems, MenuItemsType /* MoreIcon */ } from '@sweepstakes/uikit'
// import { SUPPORT_ONLY_KLAYTN } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Lottery'),
      hideSubNav: true,
      href: '/lottery',
      items: [],
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
