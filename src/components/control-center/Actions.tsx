import React, { useState } from "react";
import {
  Button,
  Box,
  Grid,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleControlCenter,
  toggleSystemDefault,
  setDarkMode,
} from "@store/actions";
import { IStore } from "@interfaces/store.interface";
import {
  Close,
  LightMode,
  DarkMode,
  SettingsBrightness,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useDeviceType } from "@/hooks/useDeviceType";
import Terminal from "../terminal";

const TerminalButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
            backdropFilter: "blur(10px)",
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "backgroundColor.transparent",
            backdropFilter: "blur(10px)",
            borderRadius: 5,
            height: "60vh",
            color: theme.palette.backgroundColor.contrastText,
          },
        }}
      >
        <Terminal />
      </Dialog>
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        disableElevation
        sx={{
          borderRadius: "50%",
          backgroundColor: "backgroundColor.light",
          border: `1px solid ${theme.palette.backgroundColor.contrastText}`,
          color: theme.palette.backgroundColor.contrastText,
          aspectRatio: "1/1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${theme.palette.accent.main}`,
            color: theme.palette.accent.main,
          },
        }}
      >
        <TerminalIcon />
      </Button>
    </>
  );
};
const CloseButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(toggleControlCenter(false));
  };
  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleClick}
      disableElevation
      sx={{
        borderRadius: "50%",
        backgroundColor: "primary.main",
        border: `1px solid ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        aspectRatio: "1/1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.backgroundColor.contrastText,
        },
      }}
    >
      <Close />
    </Button>
  );
};

const ThemeToggle = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const dispatch = useDispatch();

  const { systemDefault, darkMode } = useSelector(
    (state: IStore) => state.theme
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setTheme = (type: string) => {
    dispatch(setDarkMode(type === "dark"));
    if (!systemDefault) return;
    dispatch(toggleSystemDefault());
  };

  const handleSystemDefault = () => {
    if (systemDefault) return;
    dispatch(toggleSystemDefault());
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        disableElevation
        sx={{
          borderRadius: "50%",
          backgroundColor: "backgroundColor.light",
          border: `1px solid ${theme.palette.backgroundColor.contrastText}`,
          color: theme.palette.backgroundColor.contrastText,
          aspectRatio: "1/1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${theme.palette.accent.main}`,
            color: theme.palette.accent.main,
          },
        }}
      >
        {systemDefault ? (
          <SettingsBrightness />
        ) : darkMode ? (
          <DarkMode />
        ) : (
          <LightMode />
        )}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        sx={{
          transform: "translateY(-1rem)",
        }}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          elevation: 10,
          sx: {
            backgroundColor: "backgroundColor.transparent",
            backdropFilter: "blur(5px)",
            borderRadius: 3,
            color: theme.palette.backgroundColor.contrastText,
          },
        }}
      >
        <List
          sx={{
            py: 0,
            "& .MuiListItemButton-root:hover": {
              backgroundColor: "backgroundColor.transparent",
              color: theme.palette.accent.main,
            },
            "& .MuiListItemButton-root.Mui-selected": {
              backgroundColor: "backgroundColor.light",
              color: theme.palette.accent.main,
            },
          }}
        >
          <ListItemButton
            onClick={() => setTheme("light")}
            selected={!systemDefault && !darkMode}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
              }}
            >
              <LightMode />
            </ListItemIcon>
            <ListItemText primary="Light" />
          </ListItemButton>
          <ListItemButton
            onClick={() => setTheme("dark")}
            selected={!systemDefault && darkMode}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
              }}
            >
              <DarkMode />
            </ListItemIcon>
            <ListItemText primary="Dark" />
          </ListItemButton>
          <ListItemButton
            onClick={handleSystemDefault}
            selected={systemDefault}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
              }}
            >
              <SettingsBrightness />
            </ListItemIcon>
            <ListItemText primary="System Default" />
          </ListItemButton>
        </List>
      </Menu>
    </>
  );
};
const Actions = () => {
  const { isMobile, isDesktop } = useDeviceType();
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        transformOrigin: isMobile ? "center" : "left",
        transform: isMobile ? "scale(1)" : "scale(0.8)",
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{
          width: "100%",
          height: "fit-content",
          justifyContent: !isMobile ? "flex-start" : "space-between",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.8)" : "scale(1)",
          }}
        >
          <CloseButton />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.8)" : "scale(1)",
          }}
        >
          <ThemeToggle />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.8)" : "scale(1)",
          }}
        >
          <TerminalButton />
        </Grid>
        {isDesktop && <></>}
      </Grid>
    </Box>
  );
};

export default Actions;
