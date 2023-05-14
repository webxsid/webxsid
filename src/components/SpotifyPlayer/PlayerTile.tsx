import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Avatar, useMediaQuery } from "@mui/material";
import { History } from "@mui/icons-material";
import {
  regenerateSpotifyToken,
  getPlaybackState,
  getRefreshToken,
} from "@functions/spotify.functions";
import { setSpotifyData } from "@store/actions";
import { IStore } from "@interfaces/store.interface";
import SoundBars from "./SoundBars";
import Image from "next/image";
import SpotifyIcon from "../../assets/Images/Spotify/icon-small.png";
import SpotifyLogo from "../../assets/Images/Spotify/logo-large.png";
const SpotifyPlayerTile = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>({
    isPlaying: false,
    albumImage: "",
    albumName: "",
    albumUrl: "",
    trackName: "",
    trackUrl: "",
  });
  const {
    refreshToken: existingRefreshToken,
    open,
    accessToken,
    expiresAt,
  } = useSelector((state: IStore) => ({
    ...state.spotify,
    ...state.controlCenter,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        if (open) {
          if (accessToken && expiresAt && new Date(expiresAt) > new Date()) {
            const playerData = await getPlaybackState(accessToken);
            console.log(playerData);
            setShow(true);
            setData(playerData);
          } else {
            if (!existingRefreshToken || existingRefreshToken?.length < 1) {
              const { refreshToken } = await getRefreshToken();
              if (refreshToken) {
                const { access_token } = await regenerateSpotifyToken(
                  refreshToken
                );
                const playerData = await getPlaybackState(access_token);
                console.log(playerData);
                setShow(true);
                setData(playerData);
                dispatch(
                  setSpotifyData({
                    accessToken: access_token,
                    refreshToken: refreshToken,
                  })
                );
              } else {
                setShow(false);
              }
            } else {
              const { access_token } = await regenerateSpotifyToken(
                existingRefreshToken
              );
              const playerData = await getPlaybackState(access_token);
              console.log(playerData);
              setShow(true);
              setData(playerData);
              dispatch(
                setSpotifyData({
                  accessToken: access_token,
                  refreshToken: existingRefreshToken,
                })
              );
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, open]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1.5,
        width: "100%",
        height: "100%",
        maxHeight: "5rem",
        p: 1,
        backgroundColor: "backgroundColor.main",
        backdropFilter: "blur(15px)",
        borderRadius: "1rem",
        position: "relative",
      }}
    >
      {show ? (
        <>
          <Box
            sx={{
              position: "absolute",
              right: "0.8rem",
              top: isMobile ? "0.7rem" : "1rem",
              height: isMobile ? "21px" : "auto",
              width: isMobile ? "21px" : "70px",
            }}
          >
            <Image
              src={isMobile ? SpotifyIcon : SpotifyLogo}
              alt="Spotify logo"
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto",
              }}
            />
          </Box>
          <Box
            sx={{ height: "100%", aspectRatio: "1/1", position: "relative" }}
          >
            <Avatar
              src={data.albumImage}
              alt={data.albumName}
              variant="square"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 3,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 4,
                left: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "backgroundColor.dark",
                p: isMobile ? 0.8 : 1.2,
                borderRadius: isMobile ? 2 : 3,
              }}
            >
              {data.isPlaying ? (
                <SoundBars />
              ) : (
                <History
                  sx={{
                    fontSize: isMobile ? 12 : 25,
                  }}
                />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              alignItems: "flex-start",
              justifyContent: "center",
              flexGrow: "1",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textOverflow: "ellipsis",
                maxWidth: "10rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: isMobile ? "0.7rem" : "1rem",
                lineHeight: isMobile ? "0.7rem" : "1.2rem",
              }}
            >
              {data.trackName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "10rem",
                whiteSpace: "nowrap",
                fontSize: isMobile ? "0.6rem" : "0.8rem",
                lineHeight: isMobile ? "0.6rem" : "1rem",
                opacity: 0.5,
              }}
            >
              {data.albumName}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          Spotify is not connected
        </Typography>
      )}
    </Box>
  );
};

export default SpotifyPlayerTile;
