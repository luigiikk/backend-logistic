import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authCompanyService } from "@/services/company/authCompany.js";
import { InvalidCredentialsError } from "@/services/erros/invalid-credentials-error.js";

export const companyAuthBodySchema = z.object({
  CNPJ: z.string(),
  password: z.string().min(6),
});

type RegisterBody = z.infer<typeof companyAuthBodySchema>;

export async function authCompany(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { CNPJ, password } = request.body;

  try {
   const company = await authCompanyService({ CNPJ, password });

   const token = await reply.jwtSign(
    { sub: company.id, role: 'company' }, 
    { expiresIn: "1d" } 
  );

    return reply.status(200).send({ token });
  } catch (error) {
    if(error instanceof InvalidCredentialsError){
      return reply.status(400).send({message: error.message});
    }
    
    throw error
  }
}
