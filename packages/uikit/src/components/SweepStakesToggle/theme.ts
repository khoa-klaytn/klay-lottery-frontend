import { darkColors, lightColors } from "../../theme/colors";
import { SweepStakesToggleTheme } from "./types";

export const light: SweepStakesToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: SweepStakesToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
