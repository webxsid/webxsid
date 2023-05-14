import React, { useEffect, FC } from "react";
// * Import redux
import { useSelector, useDispatch } from "react-redux";
import { setDarkMode } from "@store/actions";
// * Import theme
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { darkTheme, lightTheme } from "@/theme";
// * Import interfaces
import { IStore, IThemeWrapperProps } from "@interfaces/index";

const ThemeWrapper: FC<IThemeWrapperProps> = ({ children }) => {
  const { darkMode, systemDefault } = useSelector(
    (state: IStore) => state.theme
  );
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const dispatch = useDispatch();

  useEffect(() => {
    if (systemDefault) {
      dispatch(setDarkMode(prefersDarkMode));
    }
  }, [prefersDarkMode, systemDefault, dispatch]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
