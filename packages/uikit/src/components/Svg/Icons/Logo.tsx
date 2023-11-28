import React from "react";
import styled from "styled-components";
import { SvgProps } from "../types";

const StyledP = styled("p")`
  /* display: none; */
  /* ${({ theme }) => theme.mediaQueries.lg} { */
  display: flex;
  align-items: center;
  /* } */
  font-weight: bold;
  font-size: 1.25rem;
`;

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = () => {
  return <StyledP>SS</StyledP>;
};

export default Icon;
