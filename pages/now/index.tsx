import React, { useEffect, useState } from "react";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { INowData } from "@interfaces/pages.data.interface";
import { setNowData } from "@store/actions/pages.data.actions";
import Section from "@components/Now/Section";
import { Refresh } from "@mui/icons-material";
import { getLastUpdateDate } from "@/firebase/realtimeDb";
const Now = () => {
  const {
    now: { data, date, error },
    loading,
    darkMode,
  } = useSelector((state: IStore) => ({ ...state.pagesData, ...state.theme }));
  const [localData, setLocalData] = useState<{
    [key: string]: {
      [key: string]: INowData[];
    };
  } | null>(null);

  const dispatch = useDispatch();

  const handleFetchData = () => {
    dispatch(setNowData());
  };

  useEffect(() => {
    (async () => {
      const lastUpdateDate = await getLastUpdateDate("now");
      if (new Date(date) <= new Date(lastUpdateDate)) {
        dispatch(setNowData());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    setLocalData(data);
  }, [data]);

  return (
    <>
      <Head>
        <title>Now x Sid</title>
      </Head>
      <CurtainLayout
        contentSx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          className="container"
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {!!localData && (
            <>
              <Section
                id="creating"
                data={localData?.creating}
                color="#EE7911"
                darkMode={darkMode}
              />
              <Section
                id="notes"
                data={localData?.notes}
                color="#BE71DB"
                darkMode={darkMode}
              />
              <Section
                id="consuming"
                data={localData?.consuming}
                color="#66CC90"
                darkMode={darkMode}
              />
            </>
          )}
          <Box
            id="scroll-view-display"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
              pt: 4,
              pb: 9,
              color: "backgroundColor.contrastText",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  color: "inherit",
                }}
              >
                About this page
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{
                  textAlign: "center",
                  fontFamily: "monospace",
                  color: "inherit",
                }}
              >
                This personal website is my own little space on the internet
                where I want to share my interests and passions with others,
                without having to please the algorithms of social media
                platforms or follow any other rules. I hope you enjoy exploring
                my digital living room as much as I enjoyed creating it.
              </Typography>
            </Box>
            {loading ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress
                  sx={{
                    color: "accent.main",
                  }}
                  size={30}
                />
                <Typography
                  variant="body2"
                  component="p"
                  sx={{ fontFamily: "monospace", color: "inherit" }}
                >
                  Fetching data...
                </Typography>
              </Box>
            ) : error && error?.length > 0 ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="body2"
                  component="p"
                  sx={{ fontFamily: "monospace", color: "error.main" }}
                >
                  {error}
                </Typography>
                <Button
                  onClick={handleFetchData}
                  variant="text"
                  sx={{
                    color: "accent.main",
                    "&:hover": {
                      color: "accent.main",
                    },
                  }}
                  startIcon={
                    <Refresh
                      sx={{
                        color: "accent.main",
                      }}
                    />
                  }
                >
                  Try again
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    fontFamily: "monospace",
                    color: "inherit",
                    opacity: 0.5,
                    fontSize: "0.7rem",
                  }}
                >
                  Updated on {new Date(date).toDateString()}, from my home in
                  India.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CurtainLayout>
    </>
  );
};

export default Now;
