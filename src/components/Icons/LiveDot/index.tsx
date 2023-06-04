import React, { FC } from "react";
import styles from "./livedot.module.css";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";
const LiveDot: FC<{
  color?: string;
}> = ({ color }) => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <div className={styles["ring-container"]}>
      <div
        className={styles["ringring"]}
        style={{
          borderColor: color
            ? color
            : router.pathname === "/now"
            ? theme.palette.accent.main
            : theme.palette.backgroundColor.contrastText,
        }}
      ></div>
      <div
        className={styles["circle"]}
        style={{
          backgroundColor: color
            ? color
            : router.pathname === "/now"
            ? theme.palette.accent.main
            : theme.palette.backgroundColor.contrastText,
        }}
      ></div>
    </div>
  );
};

export default LiveDot;
