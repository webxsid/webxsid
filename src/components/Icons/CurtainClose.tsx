import React from "react";
import { Box } from "@mui/system";
const CurtainClose = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        "& .curtain-close-bar": {
          width: "50%",
          height: 4,
          backgroundColor: "backgroundColor.contrastText",
          transition: "all 0.5s ease-in-out",
          "&.bar-1": {
            transformOrigin: "left",
          },
          "&.bar-2": {
            transformOrigin: "right",
          },
        },
        "&:hover": {
          "& .curtain-close-bar": {
            backgroundColor: "accent.main",
          },
          "& .bar-1": {
            transform: "rotate(10deg) translateX(0.1rem)",
          },
          "& .bar-2": {
            transform: "rotate(-10deg) translateX(-0.1rem)",
          },
        },
      }}
    >
      <Box
        className="curtain-close-bar bar-1"
        sx={{
          borderRadius: "3rem 0 0 3rem",
        }}
      />
      <Box
        className="curtain-close-bar bar-2"
        sx={{
          borderRadius: "0 3rem 3rem 0",
        }}
      />
    </Box>
  );
};

export default CurtainClose;
