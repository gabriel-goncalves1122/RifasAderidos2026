import { Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";

interface CheckoutPixCountdownProps {
  expiraEm?: string | null;
  onExpire?: () => void;
}

export function CheckoutPixCountdown({ expiraEm, onExpire }: CheckoutPixCountdownProps) {
  const [tempoRestante, setTempoRestante] = useState("");
  const expiredFired = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!expiraEm) {
      setTempoRestante("");
      return;
    }

    const dataExpiracao = new Date(expiraEm).getTime();

    const atualizarCronometro = () => {
      const agora = Date.now();
      const diff = dataExpiracao - agora;

      if (diff <= 0) {
        setTempoRestante("Expirado");
        if (!expiredFired.current) {
          expiredFired.current = true;
          onExpireRef.current?.();
        }
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      
      const formatado = `${String(minutos).padStart(2, "0")}:${String(
        segundos
      ).padStart(2, "0")}`;
      
      setTempoRestante(formatado);
    };

    atualizarCronometro();
    const intervalo = setInterval(atualizarCronometro, 1000);

    return () => clearInterval(intervalo);
  }, [expiraEm]);

  if (!tempoRestante) return null;

  return (
    <Typography sx={{ color: "#526760", fontSize: "0.85rem", fontWeight: 700 }}>
      {tempoRestante === "Expirado" ? "Expirado" : `Expira em ${tempoRestante}`}
    </Typography>
  );
}
