import Fab from "@mui/material/Fab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface SecretariaMobileFABProps {
  onClick: () => void;
}

export function SecretariaMobileFAB({ onClick }: SecretariaMobileFABProps) {
  return (
    <Fab
      color="primary"
      aria-label="Nova adesão"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1200,
      }}
    >
      <PersonAddIcon />
    </Fab>
  );
}
