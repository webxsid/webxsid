import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "../Logo";
const ProjectHero = () => {
  return (
    <Box
      component={"header"}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        gap: 1.5,
        px: 3,
        py: 1,
      }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: "105px" }}>
        <Logo />
      </Box>
      <Box
        id="home-Button"
        sx={{
          flexGrow: 1,
          p: 0,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1rem",
          height: "3rem",
          textTransform: "none",
          backgroundColor: "backgroundColor.light",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Projects
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectHero;
