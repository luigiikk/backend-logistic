import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authClientService } from "@/services/client/authClient.js";
import { InvalidCredentialsError } from "@/services/erros/invalid-credentials-error.js";
import { prisma } from "@/lib/prisma.js";


export const clientAuthBodySchema = z.object({
  CNPJ: z.string(),
  CPF: z.string(),
  password: z.string().min(6),
});

type ClientAuthBody = z.infer<typeof clientAuthBodySchema>;

export async function authClient(
  request: FastifyRequest<{ Body: ClientAuthBody }>,
  reply: FastifyReply
) {
  const { CNPJ, CPF, password } = request.body;

  try {
   const { client } = await authClientService({ CNPJ, CPF, password });
  
    const token = await reply.jwtSign(
      { sub: client.id, role: ''},
      { expiresIn: "1d" }
    );
    
    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}