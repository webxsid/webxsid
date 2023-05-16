import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AccountBox,
  Handshake,
  Engineering,
  AccountTree,
  Article,
  Home,
} from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import { toggleControlCenter } from "@store/actions";
import LiveDot from "../LiveDot";
interface NavButtonProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  index?: number;
  active?: boolean;
}

const NavButton: FC<NavButtonProps> = ({ href, text, icon, index, active }) => {
  const theme = useTheme();
  const { isMobile } = useDeviceType();
  const { open: controlCenterOpen } = useSelector(
    (state: IStore) => state.controlCenter
  );
  const dispatch = useDispatch();
  const handleClick = () => {
    if (controlCenterOpen) dispatch(toggleControlCenter(false));
  };
  return (
    <Link href={href} passHref onClick={handleClick}>
      {href !== "/" ? (
        <Button
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            borderRadius: 10,
            backgroundColor: active
              ? "backgroundColor.main"
              : "backgroundColor.light",
            border: `1px solid ${
              active
                ? theme.palette.accent.main
                : theme.palette.backgroundColor.contrastText
            }`,
            color: active
              ? theme.palette.accent.main
              : theme.palette.backgroundColor.contrastText,
            backdropFilter: "blur(10px)",
            textTransform: "none",
            height: isMobile ? "2.8rem" : "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "backgroundColor.main",
              border: `1px solid ${theme.palette.accent.main}`,
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              color: active
                ? theme.palette.accent.main
                : theme.palette.backgroundColor.contrastText,
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                aspectRatio: "1/1",
                height: "100%",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: active
                  ? theme.palette.accent.main
                  : theme.palette.backgroundColor.contrastText,
              }}
            >
              {icon}
            </Box>
            {text}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: active
                ? theme.palette.accent.main
                : theme.palette.backgroundColor.contrastText,
              opacity: 0.8,
              fontSize: "0.8rem",
            }}
          >
            {index}
          </Typography>
        </Button>
      ) : (
        <IconButton
          sx={{
            backgroundColor: active
              ? "backgroundColor.main"
              : "backgroundColor.light",
            border: `1px solid ${
              active
                ? theme.palette.accent.main
                : theme.palette.backgroundColor.contrastText
            }`,
            height: isMobile ? "2.8rem" : "3rem",
            width: isMobile ? "2.8rem" : "3rem",
            color: active
              ? theme.palette.accent.main
              : theme.palette.backgroundColor.contrastText,
            backdropFilter: "blur(10px)",
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "backgroundColor.main",
              border: `1px solid ${theme.palette.accent.main}`,
            },
          }}
        >
          {icon}
        </IconButton>
      )}
    </Link>
  );
};

const Navigate = () => {
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const [path, setPath] = useState<string>("");
  const [pages] = useState<
    {
      title: string;
      href: string;
      icon: React.ReactNode;
    }[]
  >([
    {
      title: "Resources",
      href: "/resources",
      icon: (
        <AccountTree
          sx={{
            color: "inherit",
            opacity: 0.8,
          }}
        />
      ),
    },
    {
      title: "Projects",
      href: "/projects",
      icon: (
        <Engineering
          sx={{
            color: "inherit",
            opacity: 0.8,
          }}
        />
      ),
    },
    {
      title: "Now",
      href: "/now",
      icon: <LiveDot />,
    },
    {
      title: "Blog",
      href: "/blog",
      icon: (
        <Article
          sx={{
            color: "inherit",
            opacity: 0.8,
          }}
        />
      ),
    },
    {
      title: "About Me",
      href: "/about-me",
      icon: (
        <AccountBox
          sx={{
            color: "inherit",
            opacity: 0.8,
          }}
        />
      ),
    },
    {
      title: "Connect",
      href: "/connect",
      icon: (
        <Handshake
          sx={{
            color: "inherit",
            opacity: 0.8,
          }}
        />
      ),
    },
  ]);

  useEffect(() => {
    setPath("/" + router.pathname.split("/")[1]);
  }, [router.pathname]);
  return (
    <Box
      sx={{
        backgroundColor: "backgroundColor.transparent",
        backdropFilter: "blur(15px)",
        borderRadius: 3,
        p: 1,
      }}
    >
      <Grid container spacing={isMobile ? 1 : 2}>
        {pages.map((page, index) => (
          <React.Fragment key={`nav-button-${index}`}>
            <Grid item xs={[2, 3].includes(index) ? 5 : 6}>
              <NavButton
                href={page.href}
                text={page.title}
                index={index + 1}
                active={path === page.href}
                icon={page.icon}
              />
            </Grid>
            {index === 2 && (
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NavButton
                  href="/"
                  active={path === "/"}
                  text="Home"
                  index={0}
                  icon={
                    <Home
                      sx={{
                        color: "inherit",
                        opacity: 0.8,
                      }}
                    />
                  }
                />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Navigate;
