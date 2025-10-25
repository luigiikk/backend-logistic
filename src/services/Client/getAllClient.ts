import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export async function getAllClientsService() {
  const prismaClientRepository = new PrismaClientRepository();

  const clients = await prismaClientRepository.getAllClients();

  return clients;
}