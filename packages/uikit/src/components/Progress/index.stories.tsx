import React, { useState } from "react";
import capitalize from "lodash/capitalize";
import random from "lodash/random";
import Box from "../Box/Box";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import Progress from "./Progress";
import { variants } from "./types";

export default {
  title: "Components/Progress",
  component: Progress,
  argTypes: {},
};

const DefaultTemplate: React.FC<React.PropsWithChildren> = (args) => {
  const [progress, setProgress] = useState(random(1, 100));

  const handleClick = () => setProgress(random(1, 100));

  return (
    <div style={{ padding: "32px", width: "400px" }}>
      {Object.values(variants).map((variant) => {
        return (
          <Box key={variant} mb="16px">
            <Heading size="md" mb="8px">
              {capitalize(variant)}
            </Heading>
            <Progress variant={variant} primaryStep={progress} {...args} />
          </Box>
        );
      })}
      <Heading size="md" mb="8px">
        Small
      </Heading>
      <Progress scale="sm" primaryStep={progress} {...args} />
      <div style={{ marginTop: "32px" }}>
        <Button type="button" scale="sm" onClick={handleClick}>
          Random Progress
        </Button>
      </div>
    </div>
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  useDark: false,
};
