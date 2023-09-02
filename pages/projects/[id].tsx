import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  useTheme,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";
import CurtainLayout from "@/components/layout/CurtainLayout";
import { IProjectData } from "@interfaces/pages.data.interface";
import { useSelector } from "react-redux";
import { IStore } from "@interfaces/store.interface";
import Head from "next/head";
import { OpenInNew } from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
const Project = () => {
  const router = useRouter();
  const { id, isFeatured } = router.query;
  const theme = useTheme();
  const { isMobile } = useDeviceType();
  const projects: IProjectData[] = useSelector(
    (state: IStore) =>
      state.pagesData.projects[isFeatured === "1" ? "featured" : "open"]
  );
  const [project, setProject] = useState<IProjectData | null>(null);
  const [challenges, setChallenges] = useState<string[]>([]);

  useEffect(() => {
    const challengesRegexPattern =
      /<\-\-\-\-\-\-\- Challenges Begin \-\-\-\-\-\-\-\-\->(.*?)<\-\-\-\-\-\-\- Challenges End \-\-\-\-\-\-\-\-\->/s;
    if (projects && projects.length) {
      const project = projects.find((item) => item.id === id);
      if (project) {
        setProject(project);
        const challengesMatch = project?.description.match(
          challengesRegexPattern
        );
        console.log(challengesMatch);
        if (challengesMatch && challengesMatch.length > 1) {
          const challenges = challengesMatch[1]
            .split("\n")
            .filter((item) => item.length > 0);
          setChallenges(challenges);
        }
      }
    }
  }, [projects, id]);

  return (
    <CurtainLayout
      contentSx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Head>
        <title>{project?.title || "Project"} x Sid</title>
      </Head>
      <Box
        className="container"
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 3,
        }}
      >
        {project ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.backgroundColor.contrastText,
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, fontSize: "2.5rem" }}
              >
                {project.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontFamily: "monospace" }}
              >
                {project.short_description}
              </Typography>
            </Box>
            {project.image ? (
              <Box sx={{ width: "100%", height: "100%" }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="responsive"
                  width={16}
                  height={9}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 10,
                  }}
                />
              </Box>
            ) : null}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                color: theme.palette.backgroundColor.contrastText,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, fontSize: "2rem", mb: 1 }}
              >
                Implementation
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontFamily: "monospace" }}
                  >
                    Status:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 400, fontFamily: "monospace" }}
                  >
                    {project.current_status}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <LinearProgress
                    color="secondary"
                    variant="determinate"
                    value={project.progress}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 1,
                  alignItems: isMobile ? "flex-start" : "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  Components:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {project.components.map((component, index) => (
                    <Chip
                      key={`project-component-${index}`}
                      label={component}
                      size="small"
                      sx={{
                        backgroundColor: "#BCECE4",
                        color: "#00201D",
                        fontWeight: 600,
                        borderRadius: 90,
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 1,
                  alignItems: isMobile ? "flex-start" : "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  Technologies:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {project.technologies.map((tech, index) => (
                    <Chip
                      key={`project-tech-${index}`}
                      label={tech}
                      size="small"
                      sx={{
                        backgroundColor: "#BCECE4",
                        color: "#00201D",
                        fontWeight: 600,
                        borderRadius: 90,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {project.github_link && (
                <Link href={project.github_link} passHref>
                  <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<OpenInNew sx={{ color: "#00201D" }} />}
                    sx={{
                      textTransform: "none",
                      height: "fit-content",
                      fontWeight: 700,
                      borderRadius: 90,
                      backgroundColor: "#BCECE4",
                      color: "#00201D",
                      mr: 1,
                      "&:hover": {
                        backgroundColor: "#BCECE4",
                        color: "#00201D",
                      },
                    }}
                  >
                    Github
                  </Button>
                </Link>
              )}
              {project.demo_link && (
                <Link href={project.demo_link} passHref>
                  <Button
                    variant="contained"
                    endIcon={<OpenInNew sx={{ color: "#00201D" }} />}
                    sx={{
                      textTransform: "none",
                      height: "fit-content",
                      fontWeight: 700,
                      borderRadius: 90,
                      backgroundColor: "#BCECE4",
                      color: "#00201D",
                      mr: 1,
                      "&:hover": {
                        backgroundColor: "#BCECE4",
                        color: "#00201D",
                      },
                    }}
                  >
                    Demo
                  </Button>
                </Link>
              )}
            </Box>
            {challenges.length > 0 && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 3,
                  color: theme.palette.backgroundColor.contrastText,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, fontSize: "2rem" }}
                >
                  Challenges
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {challenges.map((challenge, index) => (
                    <Typography
                      key={`project-challenge-${index}`}
                      variant="body1"
                      sx={{ fontWeight: 400, fontFamily: "monospace" }}
                    >
                      {challenge}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                width: "100%",
                pt: 2,
                pb: 7,
                color: "backgroundColor.contrastText",
              }}
            ></Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Project not found
            </Typography>

            <Link href="/projects" passHref>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  textTransform: "none",
                  height: "fit-content",
                  fontWeight: 700,
                  borderRadius: 90,
                }}
              >
                Go back
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </CurtainLayout>
  );
};

export default Project;
