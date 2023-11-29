import { Language } from "../LangSelector/types";
import { FlexProps } from "../Box";

export type FooterLinkType = {
  label: string;
  items: { label: string; href?: string; isHighlighted?: boolean }[];
};

export type FooterProps = {
  items: FooterLinkType[];
  buyKlayLabel: string;
  buyKlayLink: string;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  klayPriceUsd?: number;
  chainId: number;
} & FlexProps;
