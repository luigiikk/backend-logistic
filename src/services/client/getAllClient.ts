import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export async function getAllClientsService(company_id: number) {
  const prismaClientRepository = new PrismaClientRepository();

  const clients = await prismaClientRepository.getAllClients(company_id);

  return clients;
}