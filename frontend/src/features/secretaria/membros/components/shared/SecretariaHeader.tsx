import { Box, Button, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface SecretariaHeaderProps {
  total: number;
  showButton?: boolean;
  onNovaAdesao: () => void;
}

export function SecretariaHeader({
  total,
  showButton = true,
  onNovaAdesao,
}: SecretariaHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          fontWeight="900" 
          color="text.primary"
          sx={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
        >
          Secretaria
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontFamily: "Inter, sans-serif", mt: 0.5 }}
        >
          Gestão de membros e aderidos da comissão.
        </Typography>
      </Box>

      {showButton && (
        <Button
          variant="contained"
          size="medium"
          startIcon={<PersonAddIcon />}
          onClick={onNovaAdesao}
          sx={{
            borderRadius: 2.5,
            px: { xs: 2, sm: 3 },
            py: 1,
            fontWeight: "bold",
            fontFamily: "Inter, sans-serif",
            textTransform: "none",
            boxShadow: "0 4px 14px 0 rgba(2, 27, 22, 0.25)",
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          Nova Adesão ({total})
        </Button>
      )}
    </Box>
  );
}
