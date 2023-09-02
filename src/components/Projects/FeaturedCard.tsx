import React, { FC } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { IProjectData } from "@interfaces/pages.data.interface";
import Link from "next/link";
import Image from "next/image";

interface IProps {
  data: IProjectData;
}

const FeaturedCard: FC<IProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Link
      href={`/projects/${data.id}?featured=${data.is_featured ? 1 : 0}`}
      passHref
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
          px: 2,
          gap: 1,
          width: "100%",
          maxWidth: "18.75rem",
          height: "100%",
          maxHeight: "31rem",
          borderRadius: 10,
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          textDecoration: "none",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, fontSize: "2.25rem" }}
          >
            {data.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              width: "100%",
              fontWeight: 400,
              fontFamily: "monospace",
              fontSize: "1rem",
              overflow: "hidden",
            }}
          >
            {data.short_description?.length > 100
              ? data.short_description?.slice(0, 100) + "..."
              : data.short_description}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "50%",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            "&:hover": {
              "& img": {
                transform: "scale(1.1)",
              },
              "& div": {
                opacity: 1,
              },
            },
          }}
        >
          <Image
            src={data.featured_image!}
            alt={data.title}
            width={1920}
            height={1080}
            style={{
              width: "100%",
              height: "unset",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              opacity: 0,
              transition: "all 0.2s ease",
            }}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default FeaturedCard;
