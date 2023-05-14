import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "../Logo";
const AboutMeHero = () => {
  return (
    <Box
      component={"header"}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        gap: 1.5,
        px: 3,
        py: 0.5,
        zIndex: 99,
        backgroundColor: "backgroundColor.main",
      }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: "105px" }}>
        <Logo />
      </Box>
      <Box
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
          Hello, world!
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutMeHero;
