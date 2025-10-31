import {ClientUpdateParams} from "@/services/client/updateCliente.js";
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
        CNPJ: true, 
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




  async getClientByCNPJ(CNPJ: string){
    const clientWithSameCNPJ = await prisma.client.findUnique({
      where: {
        CNPJ,
      }
    });

    return clientWithSameCNPJ;
  }

async getClientByCPF(CPF: string){
    const clientWithSameCPF = await prisma.client.findUnique({
      where: {
        CPF,
      }
    });

    return clientWithSameCPF;
  }


  async deleteClient(id: number) {
    await prisma.client.delete({
      where: {
        id,
      },
    }); 
  }

    async updateClient(id: number, data: ClientUpdateParams) {
        const clientExists = await prisma.client.findUnique({ where: { id } });
        if (!clientExists) {
          throw new Error('Client not found');
        }
        await prisma.client.update({
          where: { id }, 
          data,            
        });
      }

  }
