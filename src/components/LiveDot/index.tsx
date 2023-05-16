import React from "react";
import styles from "./livedot.module.css";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";
const LiveDot = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <div className={styles["ring-container"]}>
      <div
        className={styles["ringring"]}
        style={{
          borderColor:
            router.pathname === "/now"
              ? theme.palette.accent.main
              : theme.palette.backgroundColor.contrastText,
        }}
      ></div>
      <div
        className={styles["circle"]}
        style={{
          backgroundColor:
            router.pathname === "/now"
              ? theme.palette.accent.main
              : theme.palette.backgroundColor.contrastText,
        }}
      ></div>
    </div>
  );
};

export default LiveDot;
