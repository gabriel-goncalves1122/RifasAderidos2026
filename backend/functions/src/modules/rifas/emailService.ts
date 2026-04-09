// ============================================================================
// ARQUIVO: backend/functions/src/services/emailService.ts
// ============================================================================
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "comissao0026@gmail.com",
    pass: "okei bhql jilk nuta",
  },
});

const criarTemplateEmail = (
  nome: string,
  mensagem: string,
  textoStatus: string,
  corStatus: string,
  bilhetesHtml: string,
) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
    
    <div style="background: linear-gradient(135deg, #1976d2, #283593); color: white; padding: 25px 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">COMISSÃO DE FORMATURA 2026</h2>
      <p style="margin: 5px 0 0 0; font-size: 15px; opacity: 0.9;">A contagem regressiva começou! 🎓✨</p>
    </div>

    <div style="padding: 30px 25px;">
      <h3 style="color: #333333; margin-top: 0; font-size: 20px;">E aí, ${nome}! 🎉</h3>
      <p style="color: #555555; line-height: 1.6; font-size: 16px;">${mensagem}</p>
      
      <div style="margin: 25px 0; padding: 15px 20px; border-left: 5px solid ${corStatus}; background-color: #f8f9fa; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-size: 12px; color: #777; text-transform: uppercase; font-weight: bold;">Status do Pedido</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 900; color: ${corStatus};">${textoStatus}</p>
      </div>

      <h4 style="color: #333333; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 15px;">Bilhete(s):</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${bilhetesHtml}
      </div>
    </div>

    <div style="background-color: #f5f5f5; color: #888888; padding: 20px; text-align: center; font-size: 13px;">
      <p style="margin: 0;">Este é um e-mail automático. Muito obrigado por apoiar a nossa formatura! 🚀</p>
      <p style="margin: 8px 0 0 0; font-weight: bold;">Comissão de Formatura 2026</p>
    </div>
  </div>
`;

export const enviarEmailRecibo = async (
  emailDestino: string,
  nomeComprador: string,
  numerosRifas: string[],
  status: "pendente" | "aprovado",
) => {
  if (!emailDestino || numerosRifas.length === 0) return;

  const primeiroNome = nomeComprador.split(" ")[0];

  try {
    if (status === "pendente") {
      const assunto = "⏳ Pedido recebido! Seus números estão reservados";
      const mensagem =
        "Recebemos o comprovante do seu PIX e seus números já estão guardadinhos com a gente! Nossa tesouraria vai dar aquela conferida rápida e, assim que estiver tudo certo, você receberá os bilhetes oficiais por aqui. Fique de olho!";

      const bilhetesHtml = numerosRifas
        .map(
          (num) => `
        <span style="display: inline-block; background-color: #fff3e0; color: #f57c00; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-size: 18px; border: 1px solid #ffe0b2;">
          🎟️ ${num}
        </span>
      `,
        )
        .join("");

      const html = criarTemplateEmail(
        primeiroNome,
        mensagem,
        "EM ANÁLISE",
        "#ff9800",
        bilhetesHtml,
      );

      await transporter.sendMail({
        from: '"Comissão de Formatura 2026" <comissao0026@gmail.com>',
        to: emailDestino,
        subject: assunto,
        html: html,
      });
    } else if (status === "aprovado") {
      const assunto = "🎉 Seus bilhetes tão na mão! Pagamento Aprovado";
      const mensagem =
        "Opa! Pagamento aprovadíssimo! 🚀 Muito obrigado por apoiar a nossa formatura. Este e-mail é o seu comprovante oficial para o sorteio. Boa sorte! 🍀";

      // Agrupa todas as rifas da compra em um único bloco HTML
      const bilhetesHtml = numerosRifas
        .map(
          (num) => `
        <span style="display: inline-block; background-color: #e8f5e9; color: #2e7d32; padding: 12px 24px; border-radius: 8px; font-weight: 900; font-size: 22px; border: 2px dashed #a5d6a7; text-align: center; letter-spacing: 2px;">
          🎟️ ${num}
        </span>
      `,
        )
        .join("");

      const html = criarTemplateEmail(
        primeiroNome,
        mensagem,
        "PAGAMENTO APROVADO",
        "#4caf50",
        bilhetesHtml,
      );

      await transporter.sendMail({
        from: '"Comissão de Formatura 2026" <comissao0026@gmail.com>',
        to: emailDestino,
        subject: assunto,
        html: html,
      });
    }
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
};
