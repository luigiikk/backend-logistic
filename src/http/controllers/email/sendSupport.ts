import { supportService } from "@/services/email/sendSupport.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";


export const sendSupportBodySchema =  z.object({
  email: z.string().email(),
  message: z.string().min(5),
  name: z.string().min(5),
  phone: z.string(),
  subject: z.string(),
});

type sendSupport = z.infer<typeof sendSupportBodySchema>;


export async function sendSupport(
  request: FastifyRequest<{Body: sendSupport}>,
  reply: FastifyReply
) {

  const { email, message, name, phone, subject } = request.body;

  await supportService({ email, message, name, phone, subject });

  return reply.code(200).send({ message: "Support request sent." });
}