import React, { FC } from "react";
import { Box, Typography, Grid, Button, useTheme } from "@mui/material";
import { IProjectData } from "@interfaces/index";
import FeaturedCard from "./FeaturedCard";
import { useDeviceType } from "@/hooks/useDeviceType";
import CardStack from "./CardStack";

interface IProps {
  data: IProjectData[];
}
const FeaturedSection: FC<IProps> = ({ data }) => {
  const { isDesktop } = useDeviceType();
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            textTransform: "none",
            height: "fit-content",
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
          Featured
        </Button>
      </Box>
      {!isDesktop ? (
        <CardStack cards={data} />
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            height: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.map((project: IProjectData, index: number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FeaturedCard data={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FeaturedSection;
