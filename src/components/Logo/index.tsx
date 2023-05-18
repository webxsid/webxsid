import React, { FC, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { useRouter } from "next/router";
import Base from "./Base";
import NowLogo from "./Now";

interface IProps {
  scale?: number;
}
const Logo: FC<IProps> = ({ scale = 1 }) => {
  const { darkMode, open: controlCenterOpen } = useSelector(
    (state: IStore) => ({ ...state.theme, ...state.controlCenter })
  );
  const [render, setRender] = useState<React.ReactNode>(<Base />);

  const router = useRouter();
  useEffect(() => {
    const path = router.pathname;
    console.log(path);
    switch (path) {
      case "/":
        setRender(<Base />);
        break;
      case "/now":
        setRender(<NowLogo />);
        break;
      default:
        setRender(<Base />);
        break;
    }
  }, [router.pathname]);
  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "50px",
        width: "fit-content",
        justifyContent: "center",
        position: "relative",
        transform: `scale(${scale})`,
        fontFamily: "monospace",
        color: "backgroundColor.contrastText",
      }}
    >
      {render}
    </Box>
  );
};

export default Logo;
