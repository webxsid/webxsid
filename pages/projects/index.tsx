import React, { useEffect, useState } from "react";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { IProjectData } from "@interfaces/pages.data.interface";
import { IStore } from "@interfaces/store.interface";
import { setProjectsData } from "@store/actions/pages.data.actions";
import { getLastUpdateDate } from "@/firebase/realtimeDb";
import Head from "next/head";
import FeaturedSection from "@/components/Projects/FeaturedSection";
import ProjectList from "@/components/Projects/List";
const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state: IStore) => state.pagesData);
  const [localProjects, setLocalProjects] = useState<{
    featured: IProjectData[];
    open: IProjectData[];
    closed: IProjectData[];
  }>({
    featured: [],
    open: [],
    closed: [],
  });

  const handleFetchData = () => {
    dispatch(setProjectsData());
  };

  useEffect(() => {
    (async () => {
      const lastUpdateDate = await getLastUpdateDate("projects");
      if (new Date(projects.date) <= new Date(lastUpdateDate)) {
        dispatch(setProjectsData());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalProjects({
      featured: projects.featured,
      open: projects.open,
      closed: projects.closed,
    });
  }, [projects]);

  return (
    <CurtainLayout
      contentSx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Head>
        <title>Projects x Sid</title>
      </Head>
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
        <FeaturedSection data={localProjects.featured} />
        <ProjectList title="open" data={localProjects.open} />
        <ProjectList title="closed" data={localProjects.closed} />
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
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              component="p"
              sx={{
                textAlign: "center",
                fontFamily: "monospace",
                color: "inherit",
              }}
            >
              I Have Lots Of Ideas And Projects That I Would Like To Implement.
              Many Of Them Get Lost In My Notes Or As Random Thoughts On My
              Computer. But Some Of Them Actually Happen.
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
          ) : projects.error && projects.error?.length > 0 ? (
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
                {projects.error}
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
                Updated on {new Date(projects.date).toDateString()}, from my
                home in India.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </CurtainLayout>
  );
};

export default Projects;
