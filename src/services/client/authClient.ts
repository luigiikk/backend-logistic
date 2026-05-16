import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error.js";

interface ClientAuthParams {
  CNPJ: string;
  password: string;
}

export async function authClientService({ CNPJ, password }: ClientAuthParams) {
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.getClientByCNPJ(CNPJ);
 
  if (!client) {
    throw new InvalidCredentialsError();
  }

  if (!client.password_hash) {
    throw new InvalidCredentialsError();
  }

  const doesPasswordMatch = await compare(password, client.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

  return { client };
}
