import React, { FC } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { Engineering } from "@mui/icons-material";
const ProjectsLogo: FC = () => {
  const theme = useTheme();
  const { darkMode, open: disabled } = useSelector((state: IStore) => ({
    ...state.theme,
    ...state.controlCenter,
  }));
  return (
    <Link href="/" passHref>
      <Button
        sx={{
          px: 2,
          py: 0.6,
          borderRadius: 90,
          backgroundColor: "backgroundColor.main",
          border: `1px solid ${theme.palette.accent.main}`,
          color: "accent.main",
          fontFamily: "monospace",
          textTransform: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.3,
          boxShadow: darkMode
            ? `0px 4px 30px ${theme.palette.accent.main}`
            : "none",
          "&:hover": {
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${theme.palette.accent.main}`,

            color: "accent.main",
          },
          "&.Mui-disabled": {
            color: theme.palette.accent.main,
          },
        }}
        disabled={disabled}
      >
        <Engineering
          sx={{
            fontSize: "1.2rem",
          }}
        />
        Projects
      </Button>
    </Link>
  );
};

export default ProjectsLogo;
