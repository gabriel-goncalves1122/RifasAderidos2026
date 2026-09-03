import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Tooltip } from "@mui/material";

interface PixTabTooltipProps {
  descricao: string;
}

export function PixTabTooltip({ descricao }: PixTabTooltipProps) {
  return (
    <Tooltip title={descricao} arrow>
      <Box
        component="span"
        aria-hidden
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        sx={{
          width: 20,
          height: 20,
          ml: 0.35,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "inherit",
          opacity: 0.78,
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
      </Box>
    </Tooltip>
  );
}
