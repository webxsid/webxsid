import React, { FC, useState, useEffect } from "react";
import {
  Menu,
  ListItemButton,
  Typography,
  Button,
  ListItemIcon,
} from "@mui/material";
import { useTheme } from "@mui/material";
import LiveDot from "../LiveDot";
import { Circle, Menu as MenuIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";

const NowLogo: FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [displayText, setDisplayText] = useState<string>("Now");
  const [color, setColor] = useState<string>(theme.palette.accent.main);
  const open = Boolean(anchorEl);
  const { darkMode, open: disabled } = useSelector((state: IStore) => ({
    ...state.theme,
    ...state.controlCenter,
  }));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (scrollTo: string) => {
    const scrollViewEl = document.getElementById("scroll-view");
    if (scrollTo === "scroll-view") {
      scrollViewEl?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const el = document.getElementById(scrollTo);
      if (scrollViewEl && el) {
        scrollViewEl.scrollTo({
          top: el.offsetTop - 10,
          behavior: "smooth",
        });
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const scrollViewRef = document.getElementById("scroll-view");
    const creatingRef = document.getElementById("creating");
    const notesRef = document.getElementById("notes");
    const consumingRef = document.getElementById("consuming");
    if (scrollViewRef) {
      const onScroll = (e: any) => {
        const scrollTop = e.target.scrollTop;
        if (scrollTop === 0) {
          setDisplayText("Now");
          setColor(theme.palette.accent.main);
        } else if (creatingRef && notesRef && consumingRef) {
          const creatingRect = creatingRef.getBoundingClientRect();
          const notesRect = notesRef.getBoundingClientRect();
          const consumingRect = consumingRef.getBoundingClientRect();
          if (consumingRect.top < 12) {
            setDisplayText("Consuming");
            setColor("#66CC90");
          } else if (notesRect.top < 12) {
            setDisplayText("Notes");
            setColor("#BE71DB");
          } else if (creatingRect.top < 12) {
            setDisplayText("Creating");
            setColor("#EE7911");
          }
        }
      };

      scrollViewRef.addEventListener("scroll", onScroll);

      return () => {
        scrollViewRef.removeEventListener("scroll", onScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          width: "100%",
          px: 3,
          py: 0.6,
          borderRadius: 90,
          backgroundColor: "backgroundColor.main",
          border: `1px solid ${color}`,
          color: `${color}`,
          fontFamily: "monospace",
          textTransform: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          boxShadow: darkMode ? `0px 4px 30px ${color}` : "none",
          "&:hover": {
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${color}`,

            color: `${color}`,
          },
        }}
        disabled={disabled}
      >
        <LiveDot color={color} />
        {displayText}
        <MenuIcon sx={{ color }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          transform: "translateY(1rem)",
        }}
        PaperProps={{
          elevation: 10,
          sx: {
            width: "90vw",
            backgroundColor: "backgroundColor.transparent",
            backdropFilter: "blur(5px)",
            borderRadius: 3,
            color: theme.palette.backgroundColor.contrastText,
          },
        }}
      >
        <ListItemButton
          onClick={() => handleSelect("scroll-view")}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "backgroundColor.transparent",
              color: theme.palette.accent.main,
            },
          }}
        >
          <ListItemIcon>
            <Circle
              sx={{
                color: theme.palette.accent.main,
              }}
            />
          </ListItemIcon>
          <Typography variant="body1">Now</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => handleSelect("creating")}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "backgroundColor.transparent",
              color: "#EE7911",
            },
          }}
        >
          <ListItemIcon>
            <Circle
              sx={{
                color: "#EE7911",
              }}
            />
          </ListItemIcon>
          <Typography variant="body1">Creating</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => handleSelect("notes")}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "backgroundColor.transparent",
              color: "#BE71DB",
            },
          }}
        >
          <ListItemIcon>
            <Circle
              sx={{
                color: "#BE71DB",
              }}
            />
          </ListItemIcon>
          <Typography variant="body1">Notes</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => handleSelect("consuming")}
          sx={{
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "backgroundColor.transparent",
              color: "#66CC90",
            },
          }}
        >
          <ListItemIcon>
            <Circle
              sx={{
                color: "#66CC90",
              }}
            />
          </ListItemIcon>

          <Typography variant="body1">Consuming</Typography>
        </ListItemButton>
      </Menu>
    </>
  );
};

export default NowLogo;
