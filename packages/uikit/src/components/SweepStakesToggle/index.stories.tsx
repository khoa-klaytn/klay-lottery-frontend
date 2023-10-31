import React, { useState } from "react";
import SweepStakesToggle from "./SweepStakesToggle";

export default {
  title: "Components/SweepStakesToggle",
  component: SweepStakesToggle,
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <SweepStakesToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <SweepStakesToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <SweepStakesToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
