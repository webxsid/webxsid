import React, { FC } from "react";
import { Box, Grid, Button, useTheme } from "@mui/material";
import Link from "next/link";
import { Instagram, GitHub, LinkedIn, Twitter } from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
interface NavButtonProps {
  href: string;
  icon: React.ReactNode;
}
const NavButton: FC<NavButtonProps> = ({ href, icon }) => {
  const theme = useTheme();
  return (
    <Link href={href} passHref>
      <Button
        variant="contained"
        fullWidth
        disableElevation
        sx={{
          borderRadius: "50%",
          backgroundColor: "backgroundColor.light",
          border: `1px solid ${theme.palette.backgroundColor.contrastText}`,
          color: theme.palette.backgroundColor.contrastText,
          aspectRatio: "1/1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${theme.palette.accent.main}`,
            color: theme.palette.accent.main,
          },
        }}
      >
        {icon}
      </Button>
    </Link>
  );
};
const SocialBar = () => {
  const { isMobile } = useDeviceType();
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        transformOrigin: isMobile ? "center" : "right",
        transform: isMobile ? "scale(1)" : "scale(0.8)",
      }}
    >
      <Grid container spacing={1}>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.7)" : "scale(1)",
          }}
        >
          <NavButton
            href="https://www.instagram.com/webxsid/"
            icon={<Instagram />}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.7)" : "scale(1)",
          }}
        >
          <NavButton href="https://www.github.com/sm2101/" icon={<GitHub />} />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.7)" : "scale(1)",
          }}
        >
          <NavButton
            href="https://www.linkedin.com/in/webxsid"
            icon={<LinkedIn />}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            transform: isMobile ? "scale(0.7)" : "scale(1)",
          }}
        >
          <NavButton
            href="https://www.twitter.com/webxsid/"
            icon={<Twitter />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocialBar;
