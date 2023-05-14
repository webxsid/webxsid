import React from "react";
import Head from "next/head";
import ThemeWrapper from "@/components/ThemeWrapper";
import AboutMeHero from "@/components/about-me/Hero";
import AboutMeGrid from "@/components/about-me/Grid";

const AboutMe = () => {
  return (
    <ThemeWrapper>
      <AboutMeHero />
      <Head>
        <title>Web x Sid | Hello, World!</title>
      </Head>
      <AboutMeGrid />
    </ThemeWrapper>
  );
};

export default AboutMe;
