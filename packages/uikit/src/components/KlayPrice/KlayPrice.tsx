import React from "react";
import { styled } from "styled-components";
import LogoRound from "../Svg/Icons/LogoRound";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  klayPriceUsd?: number;
  href?: string;
  showSkeleton?: boolean;
  chainId: number;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const KlayPrice: React.FC<React.PropsWithChildren<Props>> = ({
  klayPriceUsd,
  href,
  color = "textSubtle",
  showSkeleton = true,
}) => {
  return klayPriceUsd ? (
    <PriceLink href={href} target="_blank">
      <LogoRound width="24px" mr="8px" />
      <Text color={color} bold>{`$${klayPriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : showSkeleton ? (
    <Skeleton width={80} height={24} />
  ) : null;
};

export default React.memo(KlayPrice);
