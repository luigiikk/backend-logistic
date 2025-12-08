import { sendEmail } from "@/provider/email/sendEmail.js";

export async function sendSupportEmailAction({
  name,
  email,
  phone,
  message,
  subject
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}) {
  return await sendEmail({
    to: "luigimee15@gmail.com",
    subject: `Novo contato de suporte: ${subject}`,
    html: `
      <h2>Novo contato de suporte</h2>

      <p><b>Nome:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Telefone:</b> ${phone}</p>

      <br/>

      <p><b>Assunto:</b> ${subject}</p>

      <p><b>Mensagem:</b></p>
      <p>${message}</p>
    `
  });
}