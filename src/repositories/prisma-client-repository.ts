import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export class PrismaClientRepository {
  async create(data: Prisma.ClientCreateInput) {
    const client = await prisma.client.create({
      data,
    });

    return client;
  }

  async getAllClients() {
    return await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        CPF: true,
        CNPJ: true, // Adicionado
        phone_number: true,
        client_roles: true,
        addres_id: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getClient(id: number) {
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    return client;
  }

  async deleteClient(id: number) {
    await prisma.client.delete({
      where: {
        id,
      },
    });
  }
}