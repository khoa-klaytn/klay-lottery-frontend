import React from "react";
import { styled } from "styled-components";
import PlaceholderIcon from "../Svg/Icons/Placeholder";
import BackgroundImage from "./BackgroundImage";
import { BackgroundImageProps } from "./types";

const StyledProfileAvatar = styled(BackgroundImage)`
  border-radius: 50%;
`;

const StyledPlaceholderIcon = styled(PlaceholderIcon)`
  height: 100%;
  width: 100%;
`;

const ProfileAvatar: React.FC<React.PropsWithChildren<BackgroundImageProps>> = (props) => (
  <StyledProfileAvatar loadingPlaceholder={<StyledPlaceholderIcon />} {...props} />
);

export default ProfileAvatar;
