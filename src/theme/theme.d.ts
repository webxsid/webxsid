import { ButtonPropsColorOverrides } from "@mui/material";
declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
    backgroundColor: Palette["primary"];
    textColor: Palette["primary"];
  }
  interface PaletteOptions {
    accent: PaletteOptions["primary"];
    backgroundColor: PaletteOptions["primary"];
    textColor: PaletteOptions["primary"];
  }
  interface PaletteColor {
    transparent?: string;
  }

  interface SimplePaletteColorOptions {
    transparent?: string;
  }
}

declare module "@mui/material" {
  interface ButtonPropsColorOverrides {
    accent: true;
    backgroundColor: true;
    textColor: true;
  }

  interface SliderPropsColorOverrides {
    accent: true;
    backgroundColor: true;
    textColor: true;
  }
}
