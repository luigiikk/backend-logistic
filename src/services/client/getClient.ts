import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export async function getClientService(id: number) {
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.getClient(id);

  if (!client) {
    throw new Error("Client not found");
  }
  return client;
}