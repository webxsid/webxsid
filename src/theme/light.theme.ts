import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#2D3B53",
      main: "#1B2432",
      dark: "#121821",
      contrastText: "#EEF1F6",
    },
    secondary: {
      light: "#4C4A68",
      main: "#2C2B3C",
      dark: "#0B0B0F",
      contrastText: "#F0F0F4",
    },
    accent: {
      light: "#D47D5E",
      main: "#CE6C47",
      dark: "#A14A2B",
      contrastText: "#3C1C10",
    },
    textColor: {
      light: "#94ABB8",
      main: "#E7ECEF",
      dark: "#475E6B",
      contrastText: "#141B1F",
    },
    backgroundColor: {
      transparent: "#333333dd",
      light: "#333333",
      main: "#282828",
      dark: "#1a1a1a",
      contrastText: "#f2f2f2",
    },
  },
});

export default lightTheme;
