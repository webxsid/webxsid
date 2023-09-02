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
      main: "#000000",
      contrastText: "#FAFAFA",
    },
    accent: {
      light: "#D47D5E",
      main: "#0E38B1",
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
      transparent: "#E6E8EDaa",
      light: "#E6E8ED",
      main: "#FBFBFE",
      dark: "#1a1a1a",
      contrastText: "#333333",
    },
  },
});

export default lightTheme;
