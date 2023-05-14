import React, { useState } from "react";
import { Box, Collapse, Slider, Typography } from "@mui/material";
import styles from "./about-me-styles.module.scss";
import Image from "next/image";
import Smile from "@/assets/Images/Memoji/Smile.png";
import ProfessionalExperience from "./ProfessionalExperience";
const AboutMeGrid = () => {
  const [year, setYear] = useState<number>(2023);
  const [showYearSlider, setShowYearSlider] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<string>("");
  return (
    <Box
      component={"main"}
      className={styles["grid-container"]}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        pb: "75px",
        pt: "4rem",
        px: 2,
        backgroundColor: "backgroundColor.main",
        overflowY: "auto",
      }}
    >
      <Box
        id="intro"
        className={styles["intro"]}
        sx={{
          backgroundColor: "backgroundColor.dark",
          px: 3,
          borderRadius: 3,
          py: 1,
        }}
      >
        <Image
          onClick={() => setShowYearSlider(!showYearSlider)}
          src={Smile}
          alt="my memoji"
          priority
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
            }}
          >
            Hi! &#128075;
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: "2rem",
            }}
          >
            I&apos;m Sid
          </Typography>
        </Box>
        <Collapse
          in={showYearSlider}
          sx={{
            width: "100%",
            position: "absolute",
            top: "100%",
            left: "0",
            mt: 0.3,
            borderRadius: 3,
            px: 5,
            backgroundColor: "backgroundColor.dark",
            zIndex: 97,
          }}
        >
          <Slider
            defaultValue={2023}
            step={1}
            size="small"
            min={2019}
            max={2023}
            color="accent"
            onChange={(_e, value) => {
              console.log(value);
              setYear(value as number);
            }}
            value={year}
          />
        </Collapse>
      </Box>
      <Box id="description" className={styles.description}>
        Welcome to my portfolio! As a web developer with over{" "}
        {new Date().getFullYear() - 2021} years of experience, I have worked on
        a variety of projects, ranging from simple landing pages to complex web
        applications. My skills in web development technologies such as HTML,
        CSS, JavaScript, React, Node and Typescript, combined with my
        understanding of UI methodologies and trends, have enabled me to create
        engaging and user-friendly websites and web applications.
      </Box>
      <ProfessionalExperience
        open={openSection === "professional-exp"}
        onClick={() => setOpenSection("professional-exp")}
      />
    </Box>
  );
};

export default AboutMeGrid;
