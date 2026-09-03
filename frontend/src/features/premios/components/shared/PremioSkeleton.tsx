import { Box, Skeleton } from "@mui/material";

export const PremioSkeleton = () => (
  <Box
    sx={{
      borderRadius: 2.25,
      border: "1px solid rgba(2, 27, 22, 0.10)",
      overflow: "hidden",
    }}
  >
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <Box sx={{ p: 2.5, textAlign: "center" }}>
      <Skeleton
        variant="text"
        width={80}
        height={16}
        sx={{ mx: "auto", mb: 1 }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width="70%"
        height={28}
        sx={{ mx: "auto", mb: 1 }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width="90%"
        height={14}
        sx={{ mx: "auto" }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width="60%"
        height={14}
        sx={{ mx: "auto" }}
        animation="wave"
      />
    </Box>
  </Box>
);
