import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export async function getClientService(id: number, company_id: number) {
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.getClient(id, company_id);

  if (!client) {
    throw new Error("Client not found");
  }
  return client;
}