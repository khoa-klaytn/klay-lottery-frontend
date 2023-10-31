import "styled-components";
import { SweepStakesTheme } from "./theme";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends SweepStakesTheme {}
}
