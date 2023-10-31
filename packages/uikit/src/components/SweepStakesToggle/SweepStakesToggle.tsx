import React from "react";
import { SweepStakesStack, SweepStakesInput, SweepStakesLabel } from "./StyledSweepStakesToggle";
import { SweepStakesToggleProps, scales } from "./types";

const SweepStakesToggle: React.FC<React.PropsWithChildren<SweepStakesToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <SweepStakesStack scale={scale}>
    <SweepStakesInput id={props.id || "pancake-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <SweepStakesLabel scale={scale} checked={checked} htmlFor={props.id || "pancake-toggle"}>
      <div className="pancakes">
        <div className="pancake" />
        <div className="pancake" />
        <div className="pancake" />
        <div className="butter" />
      </div>
    </SweepStakesLabel>
  </SweepStakesStack>
);

export default SweepStakesToggle;
