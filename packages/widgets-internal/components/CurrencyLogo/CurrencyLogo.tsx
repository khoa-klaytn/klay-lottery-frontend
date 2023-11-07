import { Currency } from "@sweepstakes/sdk";
import { ChainId } from "@sweepstakes/chains";
import { useMemo } from "react";
import { styled } from "styled-components";
import { useHttpLocations } from "@sweepstakes/hooks";
import { TokenLogo, BinanceIcon } from "@sweepstakes/uikit";

import { getCurrencyLogoUrls } from "./utils";

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`;

export function CurrencyLogo({
  currency,
  size = "24px",
  style,
}: {
  currency?: Currency & {
    logoURI?: string | undefined;
  };
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(currency?.logoURI);

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return [];

    if (currency?.isToken) {
      const logoUrls = getCurrencyLogoUrls(currency);

      if (currency?.logoURI) {
        return [...uriLocations, ...logoUrls];
      }
      return [...logoUrls];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />;
    }
    return (
      <StyledLogo
        size={size}
        srcs={[`https://assets.pancakeswap.finance/web/native/${currency.chainId}.png`]}
        width={size}
        style={style}
      />
    );
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? "token"} logo`} style={style} />;
}
