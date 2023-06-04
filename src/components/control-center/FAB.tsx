import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleControlCenter } from "@store/actions";
import { IStore } from "@interfaces/store.interface";
import { useDeviceType } from "@/hooks/useDeviceType";
import { IconButton, Box } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";

const ControlCenterFAB = () => {
  const { open: controlCenterOpen, darkMode } = useSelector(
    (state: IStore) => ({ ...state.controlCenter, ...state.theme })
  );
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(toggleControlCenter(!controlCenterOpen));
  };

  const { isMobile } = useDeviceType();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? "1rem" : "2rem",
        left: isMobile ? "1rem" : "2rem",
        zIndex: 100000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "accent.main",
          boxShadow: darkMode ? "0px 4px 30px #FAFAFA" : "unset",
          color: "textColor.main",
          "&:hover": {
            backgroundColor: "accent.light",
          },
        }}
      >
        {controlCenterOpen ? <Close /> : <Menu />}
      </IconButton>
    </Box>
  );
};

export default ControlCenterFAB;
