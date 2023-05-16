import React from "react";
import ThemeWrapper from "@/components/ThemeWrapper";
import Head from "next/head";
import { Box, Typography } from "@mui/material";
import Smile from "@/assets/Images/Memoji/Smile.png";
import Image from "next/image";
import Link from "next/link";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { useDeviceType } from "@/hooks/useDeviceType";
export default function Home() {
  const { isMobile } = useDeviceType();

  return (
    <ThemeWrapper>
      <Head>
        <title>Web x Sid</title>
      </Head>
      <CurtainLayout liftThreshold={isMobile ? 0.4 : 0.5}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            id="scroll-view-display"
            sx={{
              height: "fit-content",
              width: "clamp(300px, 100%, 600px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              px: 2,
            }}
          >
            <Image
              src={Smile}
              alt="Smile"
              style={{
                height: isMobile ? "9rem" : "8rem",
                width: isMobile ? "9rem" : "8rem",
                transform: "rotate(-10deg)",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                color: "backgroundColor.contrastText",
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  fontFamily: "monospace",
                  textAlign: "center",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                Hello I&apos;m Siddharth Mittal
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "monospace",
                  textAlign: "center",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                }}
              >
                a{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "accent.main",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                >
                  full-stack developer
                </Typography>{" "}
                &amp;{" "}
                <Link
                  href="https://www.instagram.com/webxsid/"
                  passHref
                  target="_blank"
                >
                  <Typography
                    component="span"
                    sx={{
                      color: "accent.main",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      textDecoration: "underline",
                    }}
                  >
                    content creator
                  </Typography>
                </Link>
                , based in India.
              </Typography>
              <Typography
                variant="body2"
                component="h3"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                }}
              >
                Currently developing at{" "}
                <Link href="https://appyhigh.com/" target="_blank" passHref>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontFamily: "monospace",
                      color: "accent.main",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "accent.light",
                      },
                    }}
                  >
                    Appyhigh
                  </Typography>
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </CurtainLayout>
    </ThemeWrapper>
  );
}
