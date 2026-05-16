import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { AppError } from "../erros/AppError.js";

export async function getClientService(id: number, company_id: number) {
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.getClient(id, company_id);

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }
  
  return client;
}