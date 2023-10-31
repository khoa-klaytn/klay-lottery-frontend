import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 227.2 227.1" xmlSpace="preserve" {...props}>
      <linearGradient
        id="a"
        x1="70.6493"
        x2="197.3743"
        y1="135.4907"
        y2="262.2057"
        gradientTransform="matrix(1 0 0 -1 0 230)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#ff2f00" />
        <stop offset=".13" stopColor="#ff3f00" />
        <stop offset=".38" stopColor="#ff6700" />
        <stop offset=".59" stopColor="#ff8c00" />
      </linearGradient>
      <path fill="url(#a)" d="M186.4 26.3C167.1 10.1 142.8.8 117.6 0L59.7 153 186.4 26.3z" />
      <linearGradient
        id="b"
        x1="177.6504"
        x2="177.6504"
        y1="52.03"
        y2="197.58"
        gradientTransform="matrix(1 0 0 -1 0 230)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".2" stopColor="#f00048" />
        <stop offset=".79" stopColor="#ff8c00" />
      </linearGradient>
      <path fill="url(#b)" d="m200.9 40.8-72.8 72.8 72.8 72.8c35.1-42.2 35.1-103.5 0-145.6z" />
      <linearGradient
        id="c"
        x1="-.5245"
        x2="115.2333"
        y1="70.6967"
        y2="186.4445"
        gradientTransform="matrix(1 0 0 -1 0 230)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".09" stopColor="#850000" />
        <stop offset=".25" stopColor="#a90e00" />
        <stop offset=".45" stopColor="#ce1c00" />
        <stop offset=".64" stopColor="#e92700" />
        <stop offset=".8" stopColor="#f92d00" />
        <stop offset=".93" stopColor="#ff2f00" />
      </linearGradient>
      <path fill="url(#c)" d="m89.2 17.5-89 88.9c-1.8 28.6 7.2 56.8 25.3 79L89.2 17.5z" />
      <linearGradient
        id="d"
        x1="52.7911"
        x2="161.953"
        y1="8.5104"
        y2="71.5357"
        gradientTransform="matrix(1 0 0 -1 0 230)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".07" stopColor="#850000" />
        <stop offset=".88" stopColor="#d30168" />
      </linearGradient>
      <path fill="url(#d)" d="m113.6 128-72.8 72.8c42.2 35.1 103.4 35.1 145.6 0L113.6 128z" />{" "}
    </Svg>
  );
};

export default Icon;
