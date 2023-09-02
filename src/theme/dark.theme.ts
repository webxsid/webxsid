import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#040515",
      contrastText: "#FBFBFE",
    },
    secondary: {
      main: "#E6E8ED",
      contrastText: "#040515",
    },
    accent: {
      light: "#D47D5E",
      main: "#86B2FF",
      dark: "#A14A2B",
      contrastText: "#ffffff",
    },
    textColor: {
      light: "#94ABB8",
      main: "#E7ECEF",
      dark: "#475E6B",
      contrastText: "#141B1F",
    },
    backgroundColor: {
      transparent: "#202123aa",
      light: "#202123",
      main: "#040515",
      dark: "#1a1a1a",
      contrastText: "#FBFBFE",
    },
  },
});

export default darkTheme;
