import React, { FC, useState, useEffect, useRef } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { IChildrenProps } from "@interfaces/components";
import Logo from "../Logo";
import { Menu } from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useSelector, useDispatch } from "react-redux";
import { toggleControlCenter } from "@store/actions";
import { IStore } from "@interfaces/store.interface";
import CurtainClose from "../Icons/CurtainClose";
interface IProps extends IChildrenProps {
  liftThreshold: number;
  [key: string]: any;
}

const CurtainLayout: FC<IProps> = ({
  liftThreshold = 0.6,
  children,
  ...rest
}) => {
  const [maxLift, setMaxLift] = useState<number>(0);
  const [liftAmount, setLiftAmount] = useState<number>(0);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
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
    const threshold = !isDesktop ? 0.93 : 0.4;
    setMaxLift(window.innerHeight * threshold);
  }, [isDesktop]);

  useEffect(() => {
    const ref = curtainRef?.current;
    if (!ref) return;
    const handleWheel = (e: WheelEvent) => {
      const { deltaY } = e;
      if (deltaY === -0) return;
      if (deltaY > 0) {
        if (Math.abs(ref.scrollHeight - ref.clientHeight - ref.scrollTop) < 1) {
          dispatch(toggleControlCenter(true));
        }
      }
    };

    ref.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      ref.removeEventListener("wheel", handleWheel);
    };
  }, [dispatch]);

  useEffect(() => {
    const ref = curtainRef?.current;
    if (!ref) return;
    const handleTouchStart = (e: TouchEvent) => {
      const { clientY } = e.touches[0];
      setTouchStartY(clientY);

      const handleTouchMove = (e: TouchEvent) => {
        const { clientY } = e.touches[0];
        const touchDistance = clientY - touchStartY!;
        if (touchDistance < 0) {
          if (
            Math.abs(ref.scrollHeight - ref.clientHeight - ref.scrollTop) < 1
          ) {
            dispatch(toggleControlCenter(true));
          }
        }
      };

      const handleTouchEnd = () => {
        ref?.removeEventListener("touchmove", handleTouchMove);
        ref?.removeEventListener("touchend", handleTouchEnd);
      };

      ref?.addEventListener("touchmove", handleTouchMove, { passive: false });
      ref?.addEventListener("touchend", handleTouchEnd);
    };

    ref.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      ref.removeEventListener("touchstart", handleTouchStart);
    };
  }, [touchStartY, dispatch]);

  useEffect(() => {
    const ref = curtainRef?.current;
    if (!ref) return;
    if (controlCenterOpen) {
      setLiftAmount(maxLift);
      const scrollViewEl = document.getElementById("scroll-view-display");
      if (scrollViewEl) {
        const currentScrollY = ref.scrollTop;
        setLastScrollY(currentScrollY);
        const timeout = setTimeout(() => {
          scrollViewEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);

        return () => {
          clearTimeout(timeout);
        };
      }
    } else {
      setLiftAmount(0);
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
  }, [controlCenterOpen, maxLift, lastScrollY]);

  return (
    <>
      <Box
        role="curtain"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          width: "100%",
          overflowY: "hidden",
          zIndex: 10,
          transition: "all 0.5s ease-in-out",
          backgroundColor: "backgroundColor.main",
          borderRadius: liftAmount > 0 ? "0 0 3rem 3rem" : "0px",
          ...rest,
        }}
      >
        <Box
          ref={curtainRef}
          sx={{
            height: `calc(100vh - ${liftAmount}px)`,
            transition: "all 1s ease-in-out",
            width: "100%",
            overflow: liftAmount > 0 ? "hidden" : "auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: liftAmount > 0 ? "7vh" : "10vh",
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
            <Logo scale={liftAmount > 0 ? 0.8 : 1} />
          </Box>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              // paddingTop: liftAmount > 0 ? "7vh" : "10vh",
            }}
          >
            {children}
          </Box>
        </Box>
        <Box
          sx={{
            height: "8vh",
            position: "absolute",
            transition: "all 1s ease-in-out",
            bottom: liftAmount > 0 ? "0%" : "1rem",
            left: liftAmount > 0 ? "50%" : "1rem",
            transform: liftAmount > 0 ? `translateX(-50%)` : "translateX(0%)",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {liftAmount > 0 ? (
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
