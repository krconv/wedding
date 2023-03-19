import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "light",
  primaryColor: "earth-green",
  defaultRadius: 8,
  fontFamily: "'PT Serif', serif",
  headings: {
    fontFamily: "'PT Serif', serif",
    sizes: {
      h1: { fontSize: 42 },
      h2: { fontSize: 32 },
      h3: { fontSize: 24 },
      h4: { fontSize: 20},
    },
    fontWeight: 400,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  globalStyles: (theme) => ({
    ".mantine-Button-label": {
      fontFamily: theme.fontFamily,
      fontWeight: 400,
    },
  }),
  black: "#262421",
  white: "#FCFCFC",
  colors: {
    "midnight-blue": [
      "#EEF1F3",
      "#D2D9DF",
      "#97A6B4",
      "#798C9F",
      "#607386",
      "#424F5C",
      "#35404A",
      "#35404A",
      "#20262D",
    ],
    "earth-green": [
      "#F2F3F2",
      "#D7DBD8",
      "#BCC3BE",
      "#A1AAA5",
      "#7C8981",
      "#6D7971",
      "#555E58",
      "#3C433F",
      "#242826",
    ],
    "cloudy-gray": [
      "#FCFCFC",
      "#F1F0EF",
      "#E7E6E4",
      "#DEDBD9",
      "#D8D5D2",
      "#9C9A96",
      "#474542",
      "#3C3834",
      "#262421",
    ],
  },
};
