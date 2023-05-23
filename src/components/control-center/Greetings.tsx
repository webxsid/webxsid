import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Telegram } from "@mui/icons-material";

const Greetings = () => {
  const [name, setName] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const theme = useTheme();
  const { isMobile } = useDeviceType();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const onNameChangeSubmit = () => {
    const existingName = window.localStorage.getItem("name");
    if (existingName === newName) return;
    window.localStorage.setItem("name", newName);
    setName(newName);
    setNewName("");
  };

  useEffect(() => {
    const existingName = window.localStorage.getItem("name");
    if (existingName) {
      setName(existingName);
    } else {
      setName("Anonymous");
    }
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        maxHeight: "7rem",
        color: "backgroundColor.contrastText",
      }}
    >
      <Typography
        variant="h1"
        noWrap
        sx={{
          color: "inherit",
          fontWeight: "bold",
          width: "100%",
          px: 1,
          fontSize: "clamp(2.3rem, 5vw, 3.5rem)",
          lineHeight: "clamp(2.3rem, 5vw, 3.5rem)",
        }}
      >
        Hello! {name?.length > 0 && name}
      </Typography>
      <TextField
        variant="standard"
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            color: "inherit",
            fontFamily: "inherit",
            backgroundColor: "backgroundColor.main",
            border: `1px solid ${theme.palette.accent.main}`,
            px: 1,
            py: isMobile ? 0.7 : 1.3,
            borderRadius: 10,
          },

          "& .MuiInputBase-input": {
            textAlign: "center",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "white",
          },
        }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onNameChangeSubmit}
                sx={{
                  color: "inherit",
                  backgroundColor: "accent.main",
                  borderRadius: 10,
                }}
              >
                <Telegram
                  sx={{
                    fontSize: isMobile ? "small" : "medium",
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          sx: {
            height: "unset",
          },
        }}
        value={newName}
        onChange={handleChange}
        placeholder={
          name?.length > 0
            ? `Change your name, ${name}`
            : "What should I call you?"
        }
      />
    </Box>
  );
};

export default Greetings;
