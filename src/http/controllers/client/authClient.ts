import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authClientService } from "@/services/client/authClient.js";
import { InvalidCredentialsError } from "@/services/erros/invalid-credentials-error.js";
import { prisma } from "@/lib/prisma.js";


export const clientAuthBodySchema = z.object({
  CNPJ: z.string(),
  password: z.string().min(6),
});

type ClientAuthBody = z.infer<typeof clientAuthBodySchema>;

export async function authClient(
  request: FastifyRequest<{ Body: ClientAuthBody }>,
  reply: FastifyReply
) {
  const { CNPJ, password } = request.body;

  const { client } = await authClientService({ CNPJ, password });
  
  const token = await reply.jwtSign(
    { sub: client.id, role: 'client'},
    { expiresIn: "1d" }
  );

  return reply.status(200).send({ token });
}