import React, { FC } from "react";
import { IProjectData } from "@interfaces/pages.data.interface";
import { Lock, Settings } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  List,
  ListItem,
  Button,
} from "@mui/material";
import Link from "next/link";
import { useDeviceType } from "@/hooks/useDeviceType";
interface IListItemProps {
  data: IProjectData;
}
const ProjectListItem: FC<IListItemProps> = ({ data }) => {
  const theme = useTheme();
  return (
    <ListItem>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "min(100%, 30rem)",
            color: theme.palette.backgroundColor.contrastText,
          }}
        >
          {data.is_open ? <Settings /> : <Lock />}
          <Typography variant="h3" sx={{ fontWeight: 500, fontSize: "1.5rem" }}>
            {data.title}
          </Typography>
          <Box
            sx={{
              borderRadius: 90,
              py: 1,
              px: 4,
              border: "1px solid",
              position: "relative",
              overflow: "hidden",
              borderColor: "secondary.main",
              color: "secondary.main",
              "&::before": {
                content: "''",
                position: "absolute",
                left: 0,
                top: 0,
                borderRadius: 90,
                height: "100%",
                width: `${data.progress}%`,
                backgroundColor: `${theme.palette.secondary.main}33`,
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 400, fontSize: "0.5rem" }}
            >
              {data?.current_status}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 400,
            fontSize: "0.8rem",
            fontFamily: "monospace",
            color: theme.palette.backgroundColor.contrastText,
          }}
        >
          {data.short_description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            color: theme.palette.backgroundColor.contrastText,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              opacity: 0.5,
            }}
          >
            Last Update: {new Date(data.updated_at).toDateString()}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
};

interface IProps {
  title: string;
  data: IProjectData[];
}
const ProjectList: FC<IProps> = ({ title, data }) => {
  const theme = useTheme();
  const { isDesktop } = useDeviceType();
  return (
    <>
      {data?.length > 0 && (
        <Box
          sx={{
            width: "100%",
            py: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isDesktop ? "flex-start" : "center",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              textTransform: "capitalize",
              height: "fit-content",
              width: "fit-content",
              fontWeight: 700,
              borderRadius: 90,
            }}
            endIcon={
              <Box
                sx={{
                  width: "1.2rem",
                  height: "1.2rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2,
                  backgroundColor: `${theme.palette.secondary.main}55`,
                  color: "secondary.main",
                  border: "1px solid",
                  borderColor: "secondary.main",
                }}
              >
                <Typography variant="body1">{data.length}</Typography>
              </Box>
            }
          >
            {title}
          </Button>
          <Box sx={{ width: "100%" }}>
            <List sx={{ width: "100%" }}>
              {data.map((item, index) => (
                <React.Fragment key={`${title}-project-${index}`}>
                  {item.is_open ? (
                    <Link
                      href={`/projects/${item.id}?featured=${
                        item.is_featured ? 1 : 0
                      }`}
                      passHref
                    >
                      <ProjectListItem
                        key={`${title}-project-${index}`}
                        data={item}
                      />
                    </Link>
                  ) : (
                    <ProjectListItem
                      key={`${title}-project-${index}`}
                      data={item}
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProjectList;
