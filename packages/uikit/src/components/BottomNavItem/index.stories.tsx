import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter } from "react-router-dom";
import { PancakeProtectorIcon } from "../Svg";
import { Flex } from "../Box";
import BottomNavItem from "./BottomNavItem";
import { BottomNavItemProps } from "./types";

export default {
  title: "Components/Menu/BottomNavItem",
  component: BottomNavItem,
};

const Template: React.FC<React.PropsWithChildren<BottomNavItemProps>> = ({ ...args }) => {
  return (
    <BrowserRouter>
      <Flex p="10px">
        <BottomNavItem {...args} />
      </Flex>
    </BrowserRouter>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Game",
  href: "https://protectors.pancakeswap.finance",
  icon: PancakeProtectorIcon,
  isActive: false,
};
