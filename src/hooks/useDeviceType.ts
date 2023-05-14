import { useMediaQuery } from "@mui/material";

export const useDeviceType = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const isDesktop = useMediaQuery("(min-width: 960px)");

  return { isMobile, isTablet, isDesktop };
};
