import React from "react";
import styles from "./player.module.css";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
const SoundBars = () => {
  const { darkMode } = useSelector((state: IStore) => state.theme);

  return (
    <div className={`${styles.icon} ${!darkMode ? "light" : ""}`}>
      <span />
      <span />
      <span />
    </div>
  );
};

export default SoundBars;
