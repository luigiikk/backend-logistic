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

  async getAllClients(company_id: number) {
    return await prisma.client.findMany({
      where: {
        company_id,
      },
      include: { addres: true },
      omit: { password_hash: true, created_at: true, updated_at: true },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getClient(id: number, company_id: number) {
    const client = await prisma.client.findUnique({
      where: {
        id,
        company_id,
      },
      include: { addres: true }
    });

    return client;
  }

  async getClientByCNPJ(CNPJ: string){
    return await prisma.client.findUnique({
      where: {
        CNPJ,
      }
    });
  }

  async deleteClient(id: number) {
    await prisma.client.delete({
      where: {
        id,
      },
    }); 
  }

    async updateClient(id: number, company_id: number, data:  Prisma.ClientUpdateInput) {
        const clientExists = await prisma.client.findUnique({ where: { id } });
        
        if(clientExists?.company_id != company_id){
          throw new Error('Client not updated');
        }

        if (!clientExists) {
          throw new Error('Client not found');
        }

        return await prisma.client.update({
          where: { id },
          include: { addres: true }, 
          data,            
        });
      }
  }
