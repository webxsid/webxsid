import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

interface IProps {
  scale?: number;
}
const Logo: FC<IProps> = ({ scale = 1 }) => {
  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "50px",
        width: "100px",
        justifyContent: "center",
        position: "relative",
        transform: `scale(${scale})`,
        fontFamily: "monospace",
        color: "backgroundColor.contrastText",
      }}
    >
      <Typography
        variant={"h6"}
        sx={{
          fontSize: "15px",
          lineHeight: "20px",
          letterSpacing: "2px",
          color: "inherit",
        }}
      >
        WEB
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontSize: "15px",
          lineHeight: "20px",
          textAlign: "right",
          letterSpacing: "2px",
          color: "inherit",
        }}
      >
        SID
      </Typography>
      <Close
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          fontSize: "18px",
          transform: "translate(-29%, -50%)",
          color: "backgroundColor.contrastText",
        }}
      />
    </Box>
  );
};

export default Logo;
