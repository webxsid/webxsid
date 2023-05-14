import React, { useEffect, useState, useRef, FC } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleControlCenter } from "@store/actions";
import { useRouter } from "next/router";
import handleCommands from "./handleCommands";
import wait from "@/utils/wait.util";
import Link from "next/link";
interface ITermOutput {
  text: string;
  type: "input" | "output";
  color: string;
  size: number;
  link?: string;
}

interface IProps {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

const Terminal: FC<IProps> = ({ navOpen, setNavOpen }) => {
  const [output, setOutput] = useState<ITermOutput[]>([]);
  const [input, setInput] = useState<string>("");
  const [name, setName] = useState<string>("anon");
  const [isInputVisible, setIsInputVisible] = useState<boolean>(true);
  const [scrollingThroughHistory, setScrollingThroughHistory] =
    useState<number>(0);
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsInputVisible(false);
      setOutput((prev) => [
        ...prev,
        {
          text: `$ ${input}`,
          type: "input",
          color: "white",
          size: 1,
        },
      ]);
      const { output: newOutput, action } = handleCommands(input);
      if (newOutput && newOutput.length > 0) {
        setOutput((prev) => [...prev, ...newOutput]);
      }

      if (action) {
        if (action === "clear") {
          setOutput([]);
        }
        if (action === "fullscreen") {
          if (!navOpen) {
            setOutput((prev) => [
              ...prev,
              {
                text: "Exiting fullscreen...",
                type: "output",
                color: "#0ff",
                size: 1,
              },
            ]);
          } else {
            setOutput((prev) => [
              ...prev,
              {
                text: "Entering fullscreen...",
                type: "output",
                color: "#0ff",
                size: 1,
              },
            ]);
          }
          setNavOpen((prev) => !prev);
        }
        if (action.startsWith("name")) {
          const name = action.split(" ")[1];
          setName(name);
          localStorage.setItem("name", name);
        }
        if (action === "exit") {
          dispatch(toggleControlCenter(false));
        }
        if (action.startsWith("navigate")) {
          const path = action.split(" ")[1];
          router.push(path);
          await wait(1000);
          dispatch(toggleControlCenter(false));
        }
      }

      setInputHistory((prev) => [...prev, input]);
      setInput("");
      setScrollingThroughHistory(0);
      setIsInputVisible(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const lastInput =
        inputHistory[inputHistory.length - 1 - scrollingThroughHistory];
      if (lastInput) {
        setInput(lastInput);
        setScrollingThroughHistory((prev) => prev + 1);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (scrollingThroughHistory > 1) {
        const lastInput = inputHistory.at(-scrollingThroughHistory + 1);
        setInput(lastInput);
        setScrollingThroughHistory((prev) => prev - 1);
      } else {
        setInput("");
        setScrollingThroughHistory(0);
      }
    }
  };

  useEffect(() => {
    const ref = document.getElementById("terminal-wrapper");
    if (ref) {
      ref.scrollTop = ref.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (isInputVisible) {
      inputRef?.current?.focus();
      inputRef?.current?.scrollIntoView();
    }
  }, [isInputVisible, inputRef]);

  useEffect(() => {
    const name_local = localStorage.getItem("name");
    let startingMessages: ITermOutput[] = [
      {
        text: "Welcome to web x sid!",
        type: "output",
        color: "white",
        size: 1,
      },
      {
        text: "Type '.help' to see a list of commands.",
        type: "output",
        color: "white",
        size: 1,
      },
    ];
    if (name_local) {
      setName(name_local);
      startingMessages = [
        {
          text: `Welcome back ${name_local}!`,
          type: "output",
          color: "white",
          size: 2,
        },
        ...startingMessages,
      ];
    } else {
      startingMessages = [
        {
          text: "Hey Anonymous!",
          type: "output",
          color: "white",
          size: 2,
        },
        ...startingMessages,
      ];
    }

    setOutput(startingMessages);
  }, []);

  return (
    <Box
      component={"div"}
      id="terminal-wrapper"
      onClick={() => {
        if (isInputVisible) {
          inputRef?.current?.focus();
          inputRef?.current?.scrollIntoView();
        }
      }}
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "backgroundColor.transparent",
        backdropFilter: "blur(10px)",
        borderRadius: 5,
        color: "white",
        fontFamily: "monospace",
        fontSize: "12px",
        overflowY: "auto",
        position: "relative",
        px: 2,
      }}
    >
      <Box
        component={"div"}
        sx={{
          height: "fit-content",
          width: "100%",
          overflow: "auto",
          pt: 2,
          position: "relative",
        }}
        id={"terminal-output"}
      >
        {output.map((item, index) => (
          <React.Fragment key={index}>
            {item.link ? (
              <Link href={item.link} target="_blank" passHref>
                <Typography
                  variant={"body1"}
                  sx={{
                    color: "accent.main",
                    textDecoration: "underline",
                    fontSize: `${item.size}rem`,
                    lineHeight: `${item.size + 1}rem`,
                    fontFamily: "monospace",
                  }}
                >
                  {item.text}
                </Typography>
              </Link>
            ) : (
              <Typography
                variant={"body1"}
                sx={{
                  color: item.color,
                  fontSize: `${item.size}rem`,
                  lineHeight: `${item.size + 1}rem`,
                  fontFamily: "monospace",
                }}
              >
                {item.text}
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
      {isInputVisible && (
        <Box
          component={"div"}
          sx={{
            width: "100%",
            height: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            variant={"body1"}
            sx={{
              color: "white",
              fontSize: "1rem",
              lineHeight: "2rem",
              fontFamily: "monospace",
            }}
          >
            webxsid@
            <Typography
              component="span"
              sx={{
                color: "accent.light",
                fontFamily: "inherit",
              }}
            >
              {name}
            </Typography>
            :~$
          </Typography>
          <TextField
            variant={"standard"}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                color: "white",
                fontFamily: "monospace",
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",
                lineHeight: "2rem",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
              },
            }}
            inputRef={inputRef}
            value={input}
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              sx: {
                caretColor: "white",
                position: "relative",
                paddingRight: "20px",
              },
            }}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputEnter}
          />
        </Box>
      )}
    </Box>
  );
};

export default Terminal;
