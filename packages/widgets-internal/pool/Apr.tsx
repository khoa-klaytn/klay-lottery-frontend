import { useCallback, useMemo } from "react";
import { styled, css } from "styled-components";

import { useTranslation } from "@sweepstakes/localization";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@sweepstakes/utils/bigNumber";
import {
  Text,
  CalculateIcon,
  Skeleton,
  FlexProps,
  Button,
  RoiCalculatorModal,
  BalanceWithLoading,
  useModal,
  Flex,
} from "@sweepstakes/uikit";

import { DeserializedPool } from "./types";

const AprLabelContainer = styled(Flex)<{ enableHover: boolean }>`
  ${({ enableHover }) =>
    enableHover
      ? css`
          &:hover {
            opacity: 0.5;
          }
        `
      : null}
`;

interface AprProps<T> extends FlexProps {
  pool: DeserializedPool<T>;
  stakedBalance: BigNumber;
  showIcon: boolean;
  performanceFee?: number;
  fontSize?: string;
  shouldShowApr: boolean;
  account: string;
  autoCompoundFrequency: number;
}

export function Apr<T>({
  pool,
  showIcon,
  stakedBalance,
  fontSize = "16px",
  performanceFee = 0,
  shouldShowApr,
  account,
  autoCompoundFrequency,
  ...props
}: AprProps<T>) {
  const { stakingToken, earningToken, isFinished, earningTokenPrice, stakingTokenPrice, userData, apr } = pool;
  const { t } = useTranslation();

  const stakingTokenBalance = useMemo(
    () => (userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO),
    [userData]
  );

  const apyModalLink = useMemo(
    () => (stakingToken?.address ? `/swap?outputCurrency=${stakingToken.address}` : "/swap"),
    [stakingToken]
  );

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      earningTokenPrice={earningTokenPrice || 0}
      stakingTokenPrice={stakingTokenPrice || 0}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      stakingTokenDecimals={stakingToken.decimals}
      apr={apr}
      stakingTokenSymbol={stakingToken?.symbol || ""}
      linkLabel={t("Get %symbol%", { symbol: stakingToken?.symbol || "" })}
      linkHref={apyModalLink}
      earningTokenSymbol={earningToken?.symbol}
      autoCompoundFrequency={autoCompoundFrequency}
      performanceFee={performanceFee}
    />
  );

  const openRoiModal = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onPresentApyModal();
    },
    [onPresentApyModal]
  );

  const isValidate = apr !== undefined && !Number.isNaN(apr);

  return (
    <AprLabelContainer enableHover={!isFinished} alignItems="center" justifyContent="flex-start" {...props}>
      {isValidate || isFinished ? (
        <>
          {shouldShowApr ? (
            <>
              <BalanceWithLoading
                onClick={(event) => {
                  if (!showIcon || isFinished) return;
                  openRoiModal(event);
                }}
                fontSize={fontSize}
                isDisabled={isFinished}
                value={isFinished ? 0 : apr ?? 0}
                decimals={2}
                unit="%"
              />
              {!isFinished && showIcon && (
                <Button onClick={openRoiModal} variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
                  <CalculateIcon color="textSubtle" width="20px" />
                </Button>
              )}
            </>
          ) : (
            <Text>-</Text>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </AprLabelContainer>
  );
}
