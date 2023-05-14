import React, { useState, useEffect } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { useDeviceType } from "@/hooks/useDeviceType";
import SpotifyPlayerTile from "../SpotifyPlayer/PlayerTile";
import Navigate from "./Navigate";
import SocialBar from "./SocialBar";
import Actions from "./Actions";
import Greetings from "./Greetings";

const ControlCenter = () => {
  const [path, setPath] = useState<string>("");
  const router = useRouter();
  const { open } = useSelector((state: IStore) => state.controlCenter);

  const { isDesktop } = useDeviceType();

  useEffect(() => {
    setPath(router?.pathname);
  }, [router.pathname]);

  return (
    <Box
      sx={{
        position: "fixed",
        backgroundColor: "backgroundColor.light",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9,
        paddingTop: open ? (isDesktop ? "60vh" : "8vh") : "0",
        pb: 3,
      }}
    >
      <Box
        sx={{
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          px: 2,
        }}
      >
        {isDesktop ? (
          <Grid
            container
            columnSpacing={2}
            justifyContent={"space-between"}
            sx={{
              height: "100%",
              pb: 1,
            }}
          >
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pt: 2,
                alignItems: "flex-start",
              }}
            >
              <Greetings />
              <Box sx={{ width: "clamp(300px, 60%, 360px)" }}>
                <Actions />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Navigate />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                pt: 2,
              }}
            >
              <SpotifyPlayerTile />
              <Box sx={{ width: "clamp(300px, 60%, 360px)" }}>
                <SocialBar />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Stack
            spacing={path === "/" ? 4 : 2}
            sx={{
              height: "100%",
              justifyContent: path === "/" ? "flex-end" : "space-between",
            }}
          >
            <SpotifyPlayerTile />
            <Greetings />
            <Navigate />
            <SocialBar />
            <Actions />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ControlCenter;
