import React from "react";
import styled from "styled-components";
import { SvgProps } from "../types";

const StyledP = styled("p")`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    align-items: center;
  }
  font-weight: bold;
  font-size: 1.25rem;
`;

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = () => {
  return <StyledP>SweepStakes</StyledP>;
};

export default Logo;
