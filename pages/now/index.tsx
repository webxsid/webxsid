import React, { useEffect, useState } from "react";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { setNowData } from "@store/actions/pages.data.actions";
import Section from "@components/Now/Section";
import { Refresh } from "@mui/icons-material";

const Now = () => {
  const [openSubCategories, setOpenSubCategories] = useState<string[]>([]);
  const {
    now: { data, date, error },
    loading,
    darkMode,
  } = useSelector((state: IStore) => ({ ...state.pagesData, ...state.theme }));

  const dispatch = useDispatch();

  const handleToggleSubCategory = (key: string) => {
    if (openSubCategories.includes(key)) {
      setOpenSubCategories(openSubCategories.filter((item) => item !== key));
    } else {
      setOpenSubCategories([...openSubCategories, key]);
    }
  };

  const handleFetchData = () => {
    dispatch(setNowData());
  };

  useEffect(() => {
    if (!date || !date.length || !!error || !!error?.length) {
      handleFetchData();
    } else {
      if (
        new Date().getTime() - new Date(date).getTime() >
        1000 * 60 * 60 * 24 * 7
      ) {
        handleFetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data?.creating) {
      Object.keys(data?.creating).forEach((key) => {
        if (!openSubCategories.includes(key))
          setOpenSubCategories([...openSubCategories, key]);
      });
    }
    if (data && data?.notes) {
      Object.keys(data?.notes).forEach((key) => {
        if (!openSubCategories.includes(key))
          setOpenSubCategories([...openSubCategories, key]);
      });
    }
    if (data && data?.consuming) {
      Object.keys(data?.consuming).forEach((key) => {
        if (!openSubCategories.includes(key))
          setOpenSubCategories([...openSubCategories, key]);
      });
    }
  }, [data, openSubCategories]);
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
          <Section
            id="creating"
            data={data?.creating}
            openSubCategories={openSubCategories}
            handleToggleSubCategory={handleToggleSubCategory}
            color="#EE7911"
            darkMode={darkMode}
          />
          <Section
            id="notes"
            data={data?.notes}
            openSubCategories={openSubCategories}
            handleToggleSubCategory={handleToggleSubCategory}
            color="#BE71DB"
            darkMode={darkMode}
          />
          <Section
            id="consuming"
            data={data?.consuming}
            openSubCategories={openSubCategories}
            handleToggleSubCategory={handleToggleSubCategory}
            color="#66CC90"
            darkMode={darkMode}
          />
          <Box
            className="container"
            id="scroll-view-display"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
              py: 6,
              px: 3,
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
                variant="body1"
                component="p"
                sx={{
                  textAlign: "justify",
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
                  variant="body2"
                  component="p"
                  sx={{
                    fontFamily: "monospace",
                    color: "inherit",
                  }}
                >
                  Updated on {new Date(date).toDateString()}, from my home in
                  India.
                </Typography>
                <Button
                  onClick={handleFetchData}
                  variant="text"
                  sx={{
                    color: "accent.main",
                    textTransform: "capitalize",
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
                  Refresh
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CurtainLayout>
    </>
  );
};

export default Now;
