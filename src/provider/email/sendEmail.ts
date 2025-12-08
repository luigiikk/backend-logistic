import { Resend } from "resend";
import { env } from "@/env/index.js";

export const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: "Suporte <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }

  return data;
}
