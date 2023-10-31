import { useTranslation } from "@sweepstakes/localization";
import { getApy } from "@sweepstakes/utils/compoundApyHelpers";
import { useState } from "react";
import { styled } from "styled-components";

import { Box, Flex, Grid } from "../Box";
import { ExpandableLabel } from "../Button";
import { LinkExternal } from "../Link";
import { Text } from "../Text";

export const Footer = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => theme.colors.dropdown};
`;

export const BulletList = styled.ul`
  list-style-type: none;
  margin-top: 16px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: "•";
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`;

interface RoiCalculatorFooterProps {
  apr?: number;
  apy?: number;
  displayApr?: string;
  autoCompoundFrequency: number;
  multiplier?: string;
  linkLabel: string;
  linkHref: string;
  performanceFee: number;
  rewardCakePerSecond?: boolean;
  isLocked?: boolean;
  stableSwapAddress?: string;
  stableLpFee?: number;
  farmCakePerSecond?: string;
  totalMultipliers?: string;
}

const RoiCalculatorFooter: React.FC<React.PropsWithChildren<RoiCalculatorFooterProps>> = ({
  apr = 0,
  apy = 0,
  autoCompoundFrequency,
  linkLabel,
  linkHref,
  performanceFee,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const gridRowCount = 2;

  return (
    <Footer p="16px" flexDirection="column">
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t("Hide") : t("Details")}
      </ExpandableLabel>
      {isExpanded && (
        <Box px="8px">
          <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows={`repeat(${gridRowCount}, auto)`}>
            {!Number.isFinite(apy) && (
              <Text small textAlign="right">
                {(
                  getApy(apr, autoCompoundFrequency > 0 ? autoCompoundFrequency : 1, 365, performanceFee) * 100
                ).toFixed(2)}
                %
              </Text>
            )}
          </Grid>
          <BulletList>
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t("Calculated based on current rates.")}
              </Text>
            </li>
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t(
                  "All figures are estimates provided for your convenience only, and by no means represent guaranteed returns."
                )}
              </Text>
            </li>
            {performanceFee > 0 && (
              <li>
                <Text mt="14px" fontSize="12px" textAlign="center" color="textSubtle" display="inline">
                  {t("All estimated rates take into account this pool’s %fee%% performance fee", {
                    fee: performanceFee,
                  })}
                </Text>
              </li>
            )}
          </BulletList>
          {linkHref && (
            <Flex justifyContent="center" mt="24px">
              <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
            </Flex>
          )}
        </Box>
      )}
    </Footer>
  );
};

export default RoiCalculatorFooter;
