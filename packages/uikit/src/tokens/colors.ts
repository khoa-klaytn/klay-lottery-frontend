export const baseColors = {
  white: "white",
  failure: "#ED4B9E",
  failure33: "#ED4B9E33",
  primary: "#3D27E6",
  primary0f: "#3D27E60f",
  primary3D: "#3D27E63D",
  primaryBright: "#5854E8",
  primaryDark: "#0500A1",
  success: "#31D0AA",
  success19: "#31D0AA19",
  warning: "#FFB237",
  warning2D: "#ED4B9E2D",
  warning33: "#ED4B9E33",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#2A5D7A",
  overlay2: "#3261bc",
  overlay3: "#58578C",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
};

const darkSecondary = "#4A81E8";
const darkBubblegum = "#546180";
const darkBubblegum2 = "#556880";
const darkContrast = "#0f0d0e";
const darkContrast2 = "#3b192c";

export const lightColors = {
  ...baseColors,
  ...additionalColors,
  secondary: "#7645D9",
  secondary80: "#7645D980",
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  cardBorder: "#E7E3EB",
  contrast: "#191326",
  contrast2: "#3b192c",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  text: "#280D5F",
  text99: "#280D5F99",
  textDisabled: "#BDC2C4",
  textSubtle: "#7A6EAA",
  disabled: "#E9EAEB",
  gradientBubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
  gradientInverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
  gradientCardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
  gradientBlue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
  gradientViolet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  gradientSecondary: "linear-gradient(#53DEE9, #7645D9)",
  gradientPrimary: `linear-gradient(${darkSecondary}, ${baseColors.primaryBright})`,
  gradientInversePrimary: `linear-gradient(${darkSecondary}, ${baseColors.primaryBright})`,
  gradientSecondary2: `linear-gradient(180deg, ${darkSecondary} 0%, ${additionalColors.overlay2} 100%)`,
  gradientOverlay: `linear-gradient(180deg, ${additionalColors.overlay} 0%, ${additionalColors.overlay3} 100%)`,
  gradientContrast: `radial-gradient(103.12% 50% at 50% 50%, ${darkContrast2} 0%, ${darkContrast} 100%)`,
};

export const darkColors = {
  ...baseColors,
  ...additionalColors,
  secondary: darkSecondary,
  secondary80: `${darkSecondary}80`,
  background: "#141312",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "#1d1d1d",
  backgroundAlt2: "rgba(29, 29, 29, 0.7)",
  cardBorder: "#383241",
  contrast: "#0f0d0e",
  contrast2: darkContrast2,
  dropdown: "#1E1D20",
  dropdownDeep: "#100C18",
  invertedContrast: "#f3f1f3",
  input: "#372F47",
  inputSecondary: "#262130",
  tertiary: "#3e3e3e",
  text: "#ffffff",
  text99: "#ffffff99",
  textDisabled: "#666171",
  textSubtle: "#e3dde6",
  disabled: "#524B63",
  gradientPrimary: `linear-gradient(${darkSecondary}, ${baseColors.primaryBright})`,
  gradientInversePrimary: `linear-gradient(180deg, ${darkSecondary}, ${baseColors.primaryBright})`,
  gradientSecondary: `linear-gradient(180deg, ${darkSecondary} 0%, ${additionalColors.overlay} 100%)`,
  gradientSecondary2: `linear-gradient(180deg, ${darkSecondary} 0%, ${additionalColors.overlay2} 100%)`,
  gradientOverlay: `linear-gradient(180deg, ${additionalColors.overlay2} 0%, ${additionalColors.overlay3} 100%)`,
  gradientBubblegum: `linear-gradient(139.73deg, ${darkBubblegum} 0%, ${darkBubblegum2} 100%)`,
  gradientInverseBubblegum: `linear-gradient(139.73deg, ${darkBubblegum2} 0%, ${darkBubblegum} 100%)`,
  gradientContrast: `radial-gradient(103.12% 50% at 50% 50%, ${darkContrast2} 0%, ${darkContrast} 100%)`,
  gradientCardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
  gradientBlue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
  gradientViolet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
};
