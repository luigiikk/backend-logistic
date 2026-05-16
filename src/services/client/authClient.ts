import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error.js";
import { AppError } from "../erros/AppError.js";

interface ClientAuthParams {
  CNPJ: string;
  password: string;
}

export async function authClientService({ CNPJ, password }: ClientAuthParams) {
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.getClientByCNPJ(CNPJ);
 
  if (!client) {
    throw new AppError('Credenciais Inválidas', 401);
  }

  if (!client.password_hash) {
    throw new AppError('Credenciais Inválidas', 401);
  }

  const doesPasswordMatch = await compare(password, client.password_hash);

    if (!doesPasswordMatch) {
      throw new AppError('Credenciais Inválidas', 401);
    }

  return { client };
}
