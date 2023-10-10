import noop from "lodash/noop";
import { LinkStatus } from "./types";
import { MenuItemsType } from "../../components/MenuItems/types";
import { TrophyIcon, TrophyFillIcon, MoreIcon, DropdownMenuItems } from "../../components";
import { DropdownMenuItemType } from "../../components/DropdownMenu/types";

export const status: { NEW: LinkStatus; SOON: LinkStatus; LIVE: LinkStatus } = {
  LIVE: {
    text: "LIVE",
    color: "failure",
  },
  SOON: {
    text: "SOON",
    color: "warning",
  },
  NEW: {
    text: "NEW",
    color: "success",
  },
};

export const links: MenuItemsType[] = [
  {
    label: "Win",
    href: "/",
    icon: TrophyIcon,
    fillIcon: TrophyFillIcon,
    items: [
      {
        label: "Win",
        href: "/",
      },
      {
        label: "Lottery",
        href: "/",
      },
    ],
  },
  {
    label: "",
    href: "/",
    icon: MoreIcon,
    items: [
      {
        label: "Info & Analytics",
        href: "/",
      },
      {
        label: "IFO Token Sales",
        href: "/",
        status: status.SOON,
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: "NFT Collectibles",
        href: "/",
      },
      {
        label: "Team Leaderboard",
        href: "/",
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: "Blog",
        href: "/",
      },
      {
        label: "Docs & Guides",
        href: "/",
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
];

export const userMenulinks: DropdownMenuItems[] = [
  {
    label: "Wallet",
    onClick: noop,
    type: DropdownMenuItemType.BUTTON,
  },
  {
    label: "Transactions",
    type: DropdownMenuItemType.BUTTON,
  },
  {
    type: DropdownMenuItemType.DIVIDER,
  },
  {
    type: DropdownMenuItemType.BUTTON,
    disabled: true,
    label: "Dashboard",
  },
  {
    type: DropdownMenuItemType.BUTTON,
    disabled: true,
    label: "Portfolio",
  },
  {
    label: "Profile",
    href: "/profile",
  },
  {
    type: DropdownMenuItemType.EXTERNAL_LINK,
    href: "https://pancakeswap.finance",
    label: "Link",
  },
  {
    type: DropdownMenuItemType.DIVIDER,
  },
  {
    type: DropdownMenuItemType.BUTTON,
    onClick: noop,
    label: "Disconnect",
  },
];
