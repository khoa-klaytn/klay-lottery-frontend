import { useTranslation } from "@sweepstakes/localization";
import { Text } from "../../components";

export function NoLiquidity() {
  const { t } = useTranslation();

  return (
    <Text color="textSubtle" textAlign="center">
      {t("No liquidity found.")}
    </Text>
  );
}
