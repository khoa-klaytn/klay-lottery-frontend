// import { useIsMounted } from "@sweepstakes/hooks";
import React from "react";
import { useMatchBreakpoints } from "../../contexts";
import { Box, Flex } from "../Box";
import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  // StyledSocialLinks,
  StyledText,
  StyledToolsContainer,
} from "./styles";

import { vars } from "../../css/vars.css";
import { Button } from "../Button";
import KlayPrice from "../KlayPrice/KlayPrice";
import LangSelector from "../LangSelector/LangSelector";
import { ArrowForwardIcon, LogoIcon, LogoWithTextIcon } from "../Svg";
// import { ThemeSwitcher } from "../ThemeSwitcher";
import { FooterProps } from "./types";

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  items,
  // isDark,
  // toggleTheme,
  currentLang,
  langs,
  setLang,
  klayPriceUsd,
  buyKlayLabel,
  buyKlayLink,
  chainId,
  ...props
}) => {
  // const isMounted = useIsMounted();
  const { isXl } = useMatchBreakpoints();
  return (
    <StyledFooter
      data-theme="dark"
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      position="relative"
      {...props}
      justifyContent="center"
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <LogoWithTextIcon width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[2, null, 1]}
          flexDirection={["column", "column", "column", "column", "row", "row"]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={["42px", null, "36px"]}
        >
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      data-theme="dark"
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? vars.colors.warning : "text"}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
          <Box display={["none", null, "block"]}>{isXl ? <LogoIcon /> : <LogoWithTextIcon width="160px" />}</Box>
        </Flex>
        {/* <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} /> */}
        <StyledToolsContainer
          data-theme="dark"
          order={[1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
        >
          <Flex order={[2, null, 1]} alignItems="center">
            {/* {isMounted && <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />} */}
            <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color="textSubtle"
              dropdownPosition="top-right"
            />
          </Flex>
          <Flex order={[1, null, 2]} mb={["24px", null, "0"]} justifyContent="space-between" alignItems="center">
            <Box mr="20px">
              <KlayPrice chainId={chainId} klayPriceUsd={klayPriceUsd} href={buyKlayLink} color="textSubtle" />
            </Box>
            <Button
              data-theme="dark"
              as="a"
              href={buyKlayLink}
              target="_blank"
              scale="sm"
              endIcon={<ArrowForwardIcon color="backgroundAlt" />}
            >
              {buyKlayLabel}
            </Button>
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
