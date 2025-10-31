import { prisma } from "@/lib/prisma.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export async function deleteClientService(id: number) {
  const client = await prisma.client.findFirst({
    where: {
      id,
    },
  });

  if (!client) {
    throw new Error("Client not exists");
  }

  const prismaClientRepository = new PrismaClientRepository();

  try {
    await prismaClientRepository.deleteClient(client.id);
  } catch (error) {
    throw new Error("Error deleting client");
  }
}