import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, YoutubeIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.sweepstakes.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://blog.sweepstakes.finance/",
      },
      {
        label: "Community",
        href: "https://docs.sweepstakes.finance/contact-us/telegram",
      },
      {
        label: "KLAY",
        href: "https://docs.sweepstakes.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://sweepstakes.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.sweepstakes.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.sweepstakes.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.sweepstakes.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/sweepstakes",
      },
      {
        label: "Documentation",
        href: "https://docs.sweepstakes.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@sweepstakes-1/s/sweepstakes/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.sweepstakes.finance/help/faq#is-sweepstakes-safe-has-sweepstakes-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.sweepstakes.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/sweepstakes",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/sweepstakes",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/sweepstakesIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/sweepstakes_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/SweepStakesVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/sweepstakes_Ita",
      },
      {
        label: "русский",
        href: "https://t.me/sweepstakes_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/sweepstakesturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/sweepstakesPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/sweepstakesES",
      },
      {
        label: "日本語",
        href: "https://t.me/sweepstakesJP",
      },
      {
        label: "Français",
        href: "https://t.me/sweepstakesFR",
      },
      {
        label: "Deutsch",
        href: "https://t.me/sweepstakes_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/sweepstakes_PH",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/sweepstakesGeorgia",
      },
      {
        label: "हिन्दी",
        href: "https://t.me/sweepstakes_INDIA",
      },
      {
        label: "Announcements",
        href: "https://t.me/SweepStakesAnn",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/sweepstakes",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/sweepstakes_official",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/sweepstakes/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/sweepstakes",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@sweepstakes_official",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
