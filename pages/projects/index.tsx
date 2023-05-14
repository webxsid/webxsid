import React from "react";
import ThemeWrapper from "@components/ThemeWrapper";
import Navigation from "@/components/navigation";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import ProjectHero from "@components/projects/Hero";
const Projects = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <ThemeWrapper>
      <Navigation />
      <Box
        component={"main"}
        sx={{
          minHeight: "100vh",
          width: "100vw",
          pb: "75px",
          backgroundColor: "background.main",
        }}
      >
        <ProjectHero />
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: isMobile ? "40vh" : "60vh",
                px: 2,
                py: 1,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  backgroundImage: "url(https://source.unsplash.com/random)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "background.transparent",
                    p: 2,
                    backdropFilter: "blur(10px)",
                    width: "100%",
                    borderRadius: "1rem",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Project 1
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 400 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quod.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{ height: isMobile ? "40vh" : "60vh", width: "100%" }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeWrapper>
  );
};

export default Projects;
