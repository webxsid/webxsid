import React, { FC } from "react";
import styles from "./about-me-styles.module.scss";
import { Box, Button, Typography } from "@mui/material";
import { Download, Lock } from "@mui/icons-material";
export interface IProps {
  open: boolean;
  onClick: (event: MouseEvent) => void;
}
const ProfessionalExperience: FC = ({ open, onClick }: IProps) => {
  return (
    <>
      <Box
        id="work-header"
        className={styles["work-exp-container"]}
        sx={{
          backgroundColor: "backgroundColor.dark",
          px: 3,
          borderRadius: 3,
          pt: 1,
          pb: 2,
        }}
        onClick={onClick}
      >
        <Box id="work-header" className={styles["header"]}>
          <Typography
            component={"h6"}
            sx={{
              fontSize: "0.5rem",
              lineHeight: "0.5rem",
              opacity: 0.5,
            }}
          >
            Professional
          </Typography>
          <Typography
            component={"h3"}
            sx={{
              fontSize: "1.2rem",
              lineHeight: "1.2rem",
            }}
          >
            History
          </Typography>
        </Box>
      </Box>
      <Button
        className={styles["resume-button"]}
        sx={{
          borderRadius: 3,
        }}
        color="accent"
        variant="outlined"
        startIcon={<Download />}
      >
        Resume
      </Button>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "accent.main",
          position: "relative",
          p: 1,
          borderRadius: 3,
        }}
        className={styles["prof-exp-0"]}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            left: "0.5rem",
          }}
          className={`${styles["prof-exp_attr"]}  ${styles["prof-exp__idx"]}`}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            01.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            right: "0.5rem",
          }}
          className={styles["prof-exp__type"]}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            Internship
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "1rem",
            left: "-0.1rem",
            transform: "rotateZ(-90deg)",
          }}
          className={styles["prof-exp__status"]}
        >
          <Typography
            sx={{
              fontSize: "0.5rem",
            }}
          >
            Ongoing
          </Typography>
        </Box>
        <Box
          sx={{ py: 2, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            Appyhigh
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "backgroundColor.light",
          position: "relative",
          p: 1,
          borderRadius: 3,
        }}
        className={styles["prof-exp-1"]}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            left: "0.5rem",
          }}
          className={`${styles["prof-exp_attr"]}  ${styles["prof-exp__idx"]}`}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            02.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            right: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            Internship
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "0.4rem",
            right: "0.5rem",
          }}
        >
          <Lock
            sx={{
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "1rem",
            left: "-0.3rem",
            transform: "rotateZ(-90deg)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.4rem",
            }}
          >
            Completed
          </Typography>
        </Box>
        <Box
          sx={{ py: 2, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              textTransform: "uppercase",
            }}
          >
            FeetWings
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "backgroundColor.light",
          position: "relative",
          p: 1,
          borderRadius: 3,
        }}
        className={styles["prof-exp-2"]}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            left: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            03.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            right: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            Internship
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "0.4rem",
            right: "0.5rem",
          }}
        >
          <Lock
            sx={{
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "1rem",
            left: "-0.3rem",
            transform: "rotateZ(-90deg)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.4rem",
            }}
          >
            Completed
          </Typography>
        </Box>
        <Box
          sx={{ py: 2, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              textTransform: "uppercase",
            }}
          >
            Market Inc.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "backgroundColor.light",
          position: "relative",
          p: 1,
          borderRadius: 3,
        }}
        className={styles["prof-exp-3"]}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            left: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            04.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "0.1rem",
            right: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
            }}
          >
            Internship
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "0.4rem",
            right: "0.5rem",
          }}
        >
          <Lock
            sx={{
              fontSize: "0.7rem",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            bottom: "1rem",
            left: "-0.3rem",
            transform: "rotateZ(-90deg)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.4rem",
            }}
          >
            Completed
          </Typography>
        </Box>
        <Box
          sx={{ py: 2, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              textTransform: "uppercase",
            }}
          >
            StablX
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProfessionalExperience;
