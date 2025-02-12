import React, { ReactNode } from "react";
import { useTranslation } from "@sweepstakes/localization";
import { Flex, TooltipText, useTooltip } from "@sweepstakes/uikit";

export const AprRowWithToolTip: React.FC<React.PropsWithChildren<{ questionTooltip?: ReactNode }>> = ({
  children,
  questionTooltip,
}) => {
  const { t } = useTranslation();

  const tooltipContent = t(
    "Calculated based on current rates and subject to change based on various external variables. It is a rough estimate provided for convenience only, and by no means represents guaranteed returns."
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: "bottom-start" });

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <Flex>
        <TooltipText ref={targetRef}>{`${t("APR")}:`}</TooltipText>
        {questionTooltip}
      </Flex>
      {children}
    </Flex>
  );
};
