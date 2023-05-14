import React from "react";
import styles from "./home.module.scss";
import { Box, Typography, Button, Grid } from "@mui/material";
import Smile from "@/assets/Images/Memoji/Smile.png";
import Image from "next/image";

const HomeGrid = () => {
  return (
    <Box className={styles["grid-container"]}>
      <Box
        className={styles["img-wrapper"]}
        sx={{
          backgroundColor: "backgroundColor.dark",
          borderRadius: 3,
        }}
      >
        <Image src={Smile} alt="my memoji" priority height={120} width={120} />
      </Box>
      <Box className={styles["intro-wrapper"]}>
        <Typography variant="h5" sx={{ fontSize: "1.5rem" }}>
          Hi! &#128075;
        </Typography>
        <Typography variant="h4" sx={{ fontSize: "2.5rem" }}>
          I&apos;m Sid
        </Typography>
      </Box>
      <Box
        className={styles["description-wrapper"]}
        sx={{
          backgroundColor: "backgroundColor.light",
          px: 2,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5">
          I help people turn their{" "}
          <Typography
            variant="h5"
            component={"span"}
            className={styles["gradient-text"]}
          >
            ideas{" "}
          </Typography>
          into{" "}
          <Typography
            variant="h5"
            component={"span"}
            className={styles["gradient-text"]}
          >
            reality
          </Typography>
          .
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeGrid;
