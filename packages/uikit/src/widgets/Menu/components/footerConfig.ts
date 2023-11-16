import { ContextApi } from "@sweepstakes/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Lottery"),
        href: "/lottery",
      },
    ],
  },
  // {
  //   label: t("Developers"),
  //   items: [
  //     {
  //       label: t("Contributing"),
  //       href: "https://docs.sweepstakes.finance/developers/contributing",
  //     },
  //     {
  //       label: t("Github"),
  //       href: "https://github.com/sweepstakes",
  //     },
  //     {
  //       label: t("Bug Bounty"),
  //       href: "https://docs.sweepstakes.finance/developers/bug-bounty",
  //     },
  //   ],
  // },
  // {
  //   label: t("Support"),
  //   items: [
  //     {
  //       label: t("Contact"),
  //       href: "https://docs.sweepstakes.finance/contact-us/customer-support",
  //     },
  //     {
  //       label: t("Troubleshooting"),
  //       href: "https://docs.sweepstakes.finance/readme/help/troubleshooting",
  //     },
  //     {
  //       label: t("Documentation"),
  //       href: "https://docs.sweepstakes.finance/",
  //     },
  //   ],
  // },
  // {
  //   label: t("About"),
  //   items: [
  //     {
  //       label: t("Terms Of Service"),
  //       href: "https://sweepstakes.finance/terms-of-service",
  //     },
  //     {
  //       label: t("Blog"),
  //       href: "https://blog.sweepstakes.finance/",
  //     },
  //     {
  //       label: t("Brand Assets"),
  //       href: "https://docs.sweepstakes.finance/ecosystem-and-partnerships/brand",
  //     },
  //     {
  //       label: t("Careers"),
  //       href: "https://docs.sweepstakes.finance/team/become-a-chef",
  //     },
  //   ],
  // },
];
