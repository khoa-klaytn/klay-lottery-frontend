import React from "react";
import { SpinnerProps } from "./types";
import { Box } from "../Box";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size * 1.197} position="relative">
      Loading...
    </Box>
  );
};

export default Spinner;
