import React from "react";
import { KlayPrice, KlayPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/KlayPrice",
  component: KlayPrice,
};

const Template: React.FC<React.PropsWithChildren<KlayPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <KlayPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  klayPriceUsd: 20.0,
};
