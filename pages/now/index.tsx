import React, { useEffect, useState } from "react";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { Box, IconButton, Typography } from "@mui/material";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { setNowData } from "@store/actions/pages.data.actions";
import Section from "./Section";
import { Refresh } from "@mui/icons-material";

const Now = () => {
  const [openSubCategories, setOpenSubCategories] = useState<string[]>([]);
  const {
    now: { data, date, error },
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
  }, [dispatch]);

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
      <CurtainLayout>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: "clamp(1rem, 7vw, 20rem)",
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
            id="scroll-view-display"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
              px: "clamp(1rem, 7vw, 20rem)",
              py: 6,
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
              <Typography variant="h5" component="h3">
                About this page
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{
                  textAlign: "justify",
                  fontFamily: "monospace",
                }}
              >
                This personal website is my own little space on the internet
                where I want to share my interests and passions with others,
                without having to please the algorithms of social media
                platforms or follow any other rules. I hope you enjoy exploring
                my digital living room as much as I enjoyed creating it.
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton onClick={handleFetchData}>
                <Refresh />
              </IconButton>
              <Typography
                variant="body2"
                component="p"
                sx={{
                  fontFamily: "monospace",
                }}
              >
                Updated on {new Date(date).toDateString()}, from my home in
                India.
              </Typography>
            </Box>
          </Box>
        </Box>
      </CurtainLayout>
    </>
  );
};

export default Now;
