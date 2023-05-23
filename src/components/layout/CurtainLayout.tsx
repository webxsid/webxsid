import React, { FC, useState, useEffect, useRef } from "react";
import { Box, Button, useTheme } from "@mui/material";
import Logo from "../Logo";
import { Menu } from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useSelector, useDispatch } from "react-redux";
import { toggleControlCenter } from "@store/actions";
import { IStore } from "@interfaces/store.interface";
import CurtainClose from "../Icons/CurtainClose";
interface IProps {
  children: React.ReactNode;
  sx?: {
    [key: string]: string;
  };
  contentSx?: {
    [key: string]: string;
  };
}

const CurtainLayout: FC<IProps> = ({ children, sx, contentSx }) => {
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const curtainRef = useRef<HTMLDivElement>(null);

  const { open: controlCenterOpen } = useSelector(
    (state: IStore) => state.controlCenter
  );
  const dispatch = useDispatch();

  const { isDesktop } = useDeviceType();
  const theme = useTheme();
  const handleClose = () => {
    dispatch(toggleControlCenter(false));
  };

  const handleOpen = () => {
    dispatch(toggleControlCenter(true));
  };

  useEffect(() => {
    const ref = curtainRef?.current;
    if (!ref) return;
    if (controlCenterOpen) {
      const currentScrollY = ref.scrollTop;
      setLastScrollY(currentScrollY);
      const scrollViewEl = document.getElementById("scroll-view-display");
      if (scrollViewEl) {
        const timeout = setTimeout(() => {
          ref.scrollTo({
            top: scrollViewEl.offsetTop + scrollViewEl.offsetHeight / 2,
            behavior: "smooth",
            left: 0,
          });
        }, 1000);

        return () => {
          clearTimeout(timeout);
        };
      }
    } else {
      const timeout = setTimeout(() => {
        ref?.scrollTo({
          top: lastScrollY,
          behavior: "smooth",
          left: 0,
        });
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [controlCenterOpen, lastScrollY]);

  return (
    <>
      <Box
        role="curtain"
        className="padding-bottom"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          height: controlCenterOpen ? (isDesktop ? "60%" : "7%") : "100%",
          transition: "all 1s ease-in-out",
          width: "100%",
          overflowY: "hidden",
          zIndex: 10,
          backgroundColor: "backgroundColor.main",
          borderRadius: controlCenterOpen ? "0 0 3rem 3rem" : "0px",
          ...sx,
        }}
      >
        <Box
          id="logo-container"
          sx={{
            height: controlCenterOpen ? "7vh" : "10vh",
            width: "100%",
            position: "absolute",
            py: 1,
            top: 0,
            left: 0,
            zIndex: 99,
            backgroundColor: "backgroundColor.main",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo scale={controlCenterOpen ? 0.8 : 1} />
        </Box>
        <Box
          ref={curtainRef}
          id="scroll-view"
          role="scroll-view"
          sx={{
            height: isDesktop ? "100%" : controlCenterOpen ? "0%" : "100%",
            transition: "all 1s ease-in-out",
            width: "100%",
            overflow: controlCenterOpen ? "hidden" : "auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              paddingTop: controlCenterOpen ? "7vh" : "10vh",
              ...contentSx,
            }}
          >
            {children}
          </Box>
        </Box>
        <Box
          sx={{
            height: "8%",
            position: "absolute",
            transition: "all 1s ease-in-out",
            bottom: controlCenterOpen ? "0" : "1rem",
            left: controlCenterOpen ? "50%" : "1rem",
            transform: controlCenterOpen
              ? `translateX(-50%)`
              : "translateX(0%)",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            px: controlCenterOpen ? 4 : 0,
            backgroundColor: controlCenterOpen
              ? "backgroundColor.main"
              : "transparent",
          }}
        >
          {controlCenterOpen ? (
            <Box
              onClick={handleClose}
              sx={{
                width: "5rem",
                height: "100%",
              }}
            >
              <CurtainClose />
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleOpen}
              disableElevation
              sx={{
                borderRadius: "50%",
                backgroundColor: "backgroundColor.light",
                border: `1px solid ${theme.palette.backgroundColor.contrastText}`,
                color: theme.palette.backgroundColor.contrastText,
                aspectRatio: "1/1",
                display: "flex",
                transform: "scale(0.8)",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "backgroundColor.main",
                  border: `1px solid ${theme.palette.accent.main}`,
                  color: theme.palette.accent.main,
                },
              }}
            >
              <Menu />
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CurtainLayout;
