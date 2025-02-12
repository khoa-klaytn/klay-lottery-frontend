import { ElementType, ReactElement, ReactNode } from "react";
import type { Language } from "@sweepstakes/localization";
import { FooterLinkType } from "../../components/Footer/types";
import { MenuItemsType } from "../../components/MenuItems/types";
import { SubMenuItemsType } from "../../components/SubMenuItems/types";
import { Colors } from "../../theme/types";

export interface LinkStatus {
  text: string;
  color: keyof Colors;
}

export interface NavProps {
  linkComponent?: ElementType;
  rightSide?: ReactNode;
  banner?: ReactElement;
  links: Array<MenuItemsType>;
  subLinks?: Array<SubMenuItemsType>;
  footerLinks: Array<FooterLinkType>;
  activeItem?: string;
  activeSubItem?: string;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  klayPriceUsd?: number;
  currentLang: string;
  buyKlayLabel: string;
  buyKlayLink: string;
  langs: Language[];
  chainId: number;
  setLang: (lang: Language) => void;
}
