import React, { FC } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { INowData } from "@interfaces/pages.data.interface";
import { ArrowRight, Circle, OpenInNew } from "@mui/icons-material";
import { useDeviceType } from "@/hooks/useDeviceType";
import Link from "next/link";
interface IProps {
  data: {
    [key: string]: INowData[];
  };
  openSubCategories: string[];
  handleToggleSubCategory: (key: string) => void;
  color: string;
  id: string;
  darkMode: boolean;
}
const Section: FC<IProps> = ({
  data,
  openSubCategories,
  handleToggleSubCategory,
  color,
  id,
  darkMode,
}) => {
  const { isMobile } = useDeviceType();
  return (
    <Box
      id={id}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 1,
        py: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Chip
          sx={{
            px: 3,
            backgroundColor: darkMode ? `${color}` : "backgroundColor.light",
            border: `1px solid ${color}`,
            color: darkMode ? "#000" : color,
            boxShadow: darkMode
              ? `0px -4px 11px ${color}, 0px 4px 11px ${color}, 0px -4px 4px ${color}`
              : "none",
          }}
          label={
            <Typography
              variant="h5"
              component="h3"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {id}
            </Typography>
          }
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {Object.entries(data || {}).map(([key, value]) => (
          <React.Fragment key={key}>
            <Button
              disableElevation
              disableRipple
              disableTouchRipple
              disableFocusRipple
              sx={{
                px: 3,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              onClick={() => handleToggleSubCategory(key)}
            >
              <ArrowRight
                sx={{
                  transform: openSubCategories.includes(key)
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                  transition: "all 0.2s ease-in-out",
                  color: `${color}`,
                  fontSize: "3rem",
                }}
              />
              <Typography
                variant="body1"
                component="p"
                sx={{
                  color: `${color}`,
                }}
              >
                {key}
              </Typography>
            </Button>
            <Collapse
              in={openSubCategories.includes(key)}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                sx={{
                  pl: 3,
                }}
              >
                {value.map((item: INowData) => (
                  <ListItem key={item.title}>
                    <ListItemIcon>
                      <Circle
                        sx={{
                          color: `${color}`,
                          fontSize: "1rem",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: isMobile ? "center" : "flex-start",
                            alignItems: isMobile ? "flex-start" : "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h6"
                            sx={{
                              color: "backgroundColor.contrastText",
                            }}
                          >
                            {item.title}
                          </Typography>
                          {item?.progress !== null && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                opacity: 0.8,
                                transform: isMobile
                                  ? "scale(0.6)"
                                  : "scale(0.8)",
                                transformOrigin: isMobile ? "left" : "right",
                              }}
                            >
                              <CircularProgress
                                variant="determinate"
                                value={item.progress}
                                sx={{
                                  color: `${color}`,
                                }}
                                size={20}
                              />
                              <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                  color: `${color}`,
                                }}
                              >
                                {item.progress}% Completed
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              color: "backgroundColor.contrastText",
                              mt: 1,
                              opacity: 0.8,
                            }}
                          >
                            {item.description}
                          </Typography>
                          {item?.link && (
                            <Link href={item.link} passHref target="_blank">
                              <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                  color: `${color}`,
                                  opacity: 0.8,
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {item?.link_text ? item.link_text : item.link}
                                <OpenInNew sx={{ fontSize: "1rem" }} />
                              </Typography>
                            </Link>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Section;
