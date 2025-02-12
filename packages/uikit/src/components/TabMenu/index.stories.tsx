import React, { useState } from "react";
import { styled } from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import TabMenu from "./TabMenu";
import Tab from "./Tab";

export default {
  title: "Components/Tab Menu",
  component: TabMenu,
  argTypes: {},
} as Meta;

const Row = styled.div`
  margin-bottom: 32px;
`;

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [index3, setIndex3] = useState(0);
  const handleClick3 = (newIndex) => setIndex3(newIndex);

  return (
    <>
      <Row>
        <TabMenu activeIndex={index3} onItemClick={handleClick3}>
          <Tab>Really long tab name</Tab>
          <Tab>Short</Tab>
          <Tab>Medium length</Tab>
        </TabMenu>
      </Row>
    </>
  );
};

export const Tabs: React.FC<React.PropsWithChildren> = () => {
  return (
    <>
      <Row>
        <Tab>Default</Tab>
        <Tab color="primary" backgroundColor="secondary">
          Custom colors
        </Tab>
      </Row>
      <Row>
        <Tab scale="md">Small scale (md)</Tab>
        <Tab scale="lg">Large scale (lg)</Tab>
      </Row>
    </>
  );
};
