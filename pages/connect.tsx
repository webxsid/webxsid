import React, { useState, useEffect } from "react";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { Box } from "@mui/material";
import { useDeviceType } from "@/hooks/useDeviceType";
import ThemeWrapper from "@/components/ThemeWrapper";
import Head from "next/head";

const Connect = () => {
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const threshold = isMobile ? 0.65 : 0.6;
    setPaddingTop(window.innerHeight * threshold);
  }, [isMobile]);

  return (
    <ThemeWrapper>
      <Head>
        <title>Connect x Sid</title>
      </Head>
      <CurtainLayout liftThreshold={isMobile ? 0.4 : 0.5}>
        <></>
      </CurtainLayout>
      <Box
        id="main-content"
        component={"main"}
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          width: "100vw",
          overflowY: "auto",
          paddingTop: `${paddingTop}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </ThemeWrapper>
  );
};

export default Connect;
