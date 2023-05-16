import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";

const Greetings = () => {
  const [name, setName] = useState<string>("");
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onBlur = () => {
    const existingName = window.localStorage.getItem("name");
    if (existingName === name) return;
    if (name === "") {
      setName("Anonymous");
      window.localStorage.setItem("name", "Anonymous");
      toast.dark(`Hello, Anonymous!`, {
        position: "bottom-right",
      });
      return;
    }
    window.localStorage.setItem("name", name);
    toast.dark(`Hello, ${name}!`, {
      position: "bottom-right",
    });
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
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        maxHeight: "5rem",
        color: "backgroundColor.contrastText",
      }}
    >
      <Typography
        sx={{
          color: "inherit",
          fontFamily: "monospace",
          fontSize: "clamp(2rem, 5vw, 2.5rem)",
          lineHeight: "clamp(2rem, 5vw, 2.5rem)",
        }}
      >
        Hello,
      </Typography>
      <Tooltip
        placement="bottom"
        arrow
        followCursor
        PopperProps={{
          sx: {
            transition: "unset",
          },
        }}
        title={
          <Typography
            sx={{
              color: "white",
              fontFamily: "monospace",
              fontSize: "0.7rem",
              lineHeight: "0.8rem",
            }}
          >
            Click to edit
          </Typography>
        }
      >
        <TextField
          variant="standard"
          sx={{
            "& .MuiInputBase-root": {
              color: "inherit",
              fontFamily: "monospace",
            },

            "& .MuiInputBase-input": {
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              lineHeight: "clamp(2rem, 5vw, 2.5rem)",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
            },
            borderBottom: `1px dashed ${theme.palette.backgroundColor.contrastText}`,
          }}
          InputProps={{
            disableUnderline: true,
          }}
          inputProps={{
            sx: {
              height: "unset",
            },
          }}
          onBlur={onBlur}
          value={name}
          onChange={handleChange}
          placeholder="Anonymous"
        />
      </Tooltip>
    </Box>
  );
};

export default Greetings;
