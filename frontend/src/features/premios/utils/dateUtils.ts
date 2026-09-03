export const formatarDataExtenso = (dataIso: string) => {
  if (!dataIso || !dataIso.includes("-")) return dataIso;
  const [ano, mes, dia] = dataIso.split("-");
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
};

export const calcularDiasRestantes = (dataIso: string): number | null => {
  if (!dataIso || !dataIso.includes("-")) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataSorteio = new Date(dataIso + "T00:00:00");
  const diff = dataSorteio.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
