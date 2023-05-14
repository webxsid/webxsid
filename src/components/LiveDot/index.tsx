import React from "react";
import styles from "./livedot.module.css";
const LiveDot = () => {
  return (
    <div className={styles["ring-container"]}>
      <div className={styles["ringring"]}></div>
      <div className={styles["circle"]}></div>
    </div>
  );
};

export default LiveDot;
