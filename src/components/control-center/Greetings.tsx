import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Tooltip } from "@mui/material";
import { toast } from "react-toastify";

const Greetings = () => {
  const [name, setName] = useState<string>("");

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
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-start",
        height: "100%",
        justifyContent: "center",
        maxHeight: "8rem",
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontFamily: "monospace",
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          lineHeight: "clamp(1.5rem, 5vw, 2.5rem)",
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
              color: "white",
              fontFamily: "monospace",
            },

            "& .MuiInputBase-input": {
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              lineHeight: "clamp(1.5rem, 5vw, 2.5rem)",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
            },
            borderBottom: "1px dashed white",
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
