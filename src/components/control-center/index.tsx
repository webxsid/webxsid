import React from "react";
import { Box, Grid, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { useDeviceType } from "@/hooks/useDeviceType";
import SpotifyPlayerTile from "../SpotifyPlayer/PlayerTile";
import Navigate from "./Navigate";
import SocialBar from "./SocialBar";
import Actions from "./Actions";
import Greetings from "./Greetings";

const ControlCenter = () => {
  const { open } = useSelector((state: IStore) => state.controlCenter);

  const { isDesktop } = useDeviceType();

  return (
    <Box
      className="padding-bottom"
      sx={{
        position: "fixed",
        backgroundColor: "backgroundColor.light",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100%",
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
            spacing={1}
            sx={{
              height: "100%",
              justifyContent: "space-between",
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
