import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface Props {
  open: boolean;
  onClose: () => void;
  notificacoes: any[];
}

export function NotificacoesSidebar({ open, onClose, notificacoes }: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 400 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary.main"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <NotificationsIcon /> Caixa de Mensagens
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {notificacoes.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <CheckCircleIcon
                sx={{ fontSize: 60, color: "success.light", opacity: 0.5 }}
              />
              <Typography color="text.secondary" mt={2}>
                Você não tem novas mensagens.
              </Typography>
            </Box>
          ) : (
            notificacoes.map((notificacao) => (
              <ListItem
                key={notificacao.id}
                sx={{
                  mb: 2,
                  bgcolor: "#fff0f0",
                  borderRadius: 2,
                  borderLeft: "4px solid #f44336",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "error.main" }}>
                      <CancelIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notificacao.titulo}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      color: "error.main",
                    }}
                    secondary={new Date(
                      notificacao.data_criacao,
                    ).toLocaleDateString("pt-BR")}
                  />
                </Box>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ mt: 1, mb: 1 }}
                >
                  Motivo: {notificacao.mensagem}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Rifas devolvidas:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
                >
                  {(notificacao.rifas || []).map((rifa: string) => (
                    <Chip
                      key={rifa}
                      label={rifa}
                      size="small"
                      variant="outlined"
                      color="error"
                    />
                  ))}
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Drawer>
  );
}
