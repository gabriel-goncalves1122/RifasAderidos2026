import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Fab, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { secretariaColors } from "../../../styles/colors";
import { TIPOS_CADASTRO_DOCUMENTO } from "../../constants/documentosTipos";
import type { TipoDocumentoCadastro } from "../../types/documentosSecretariaTypes";

interface AdicionarDocumentoMenuProps {
  onSelecionarTipo: (tipo: TipoDocumentoCadastro) => void;
}

const opcoes: Array<{
  tipo: TipoDocumentoCadastro;
  icon: ReactNode;
}> = [
  { tipo: "pdf", icon: <PictureAsPdfOutlinedIcon /> },
  { tipo: "planilha", icon: <TableChartOutlinedIcon /> },
  { tipo: "imagem", icon: <ImageOutlinedIcon /> },
];

export function AdicionarDocumentoMenu({
  onSelecionarTipo,
}: AdicionarDocumentoMenuProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleSelecionar = (tipo: TipoDocumentoCadastro) => {
    onSelecionarTipo(tipo);
    setOpen(false);
  };

  return (
    <Box
      data-testid="adicionar-documento-menu"
      data-side="right"
      sx={{
        position: "fixed",
        right: {
          xs: "max(18px, env(safe-area-inset-right, 0px))",
          sm: 28,
        },
        bottom: {
          xs: "calc(env(safe-area-inset-bottom, 0px) + 22px)",
          sm: 28,
        },
        zIndex: (theme) => theme.zIndex.speedDial,
      }}
    >
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            sx={{
              position: "absolute",
              right: 2,
              bottom: "calc(100% + 10px)",
              display: "grid",
              gap: 1,
              p: 0.75,
              borderRadius: 999,
              bgcolor: secretariaColors.branco,
              border: `1px solid ${secretariaColors.borda}`,
              boxShadow: "0 16px 36px rgba(2, 27, 22, 0.16)",
              zIndex: 5,
            }}
          >
            {opcoes.map(({ tipo, icon }) => (
              <Tooltip key={tipo} title={TIPOS_CADASTRO_DOCUMENTO[tipo].label}>
                <IconButton
                  size="small"
                  aria-label={`Adicionar ${TIPOS_CADASTRO_DOCUMENTO[tipo].label}`}
                  onClick={() => handleSelecionar(tipo)}
                  sx={{
                    width: 38,
                    height: 38,
                    color: secretariaColors.verdeEscuro,
                    bgcolor: "rgba(6, 61, 49, 0.08)",
                    "&:hover": {
                      bgcolor: "rgba(6, 61, 49, 0.14)",
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}
      </AnimatePresence>

      <Fab
        color="primary"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Adicionar documento"
        onClick={() => setOpen((atual) => !atual)}
        sx={{
          boxShadow: "0 4px 14px 0 rgba(2, 27, 22, 0.25)",
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
