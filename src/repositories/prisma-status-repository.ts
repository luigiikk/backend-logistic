import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";
import { StatusUpdateParams } from "@/services/status/updateStatus.js";

export class PrismaStatusRepository {
  async create(data: Prisma.StatusCreateInput) {
    const status = await prisma.status.create({
      data,
    });

    return status;
  }

  async getDefault(company_id: number, type: string) {
    const status = await prisma.status.findFirst({
      where: {
        company_id,
        type,
        is_default: true,
      },
    });

    return status;
  }

  async getAllStatusByCompany(company_id: number) {
  return await prisma.status.findMany({
    where: { company_id }, 
    select: {
      name: true,
      type: true,
      is_default: true,
    },
  });
}


  async getStatus(id: number, company_id: number) {
    const status = await prisma.status.findUnique({
      where: {
        id,
        company_id,
      },
    });

    return status;
  }

  async deleteStatus(id: number) {
    await prisma.status.delete({
      where: {
        id,
      },
    });
  }

  async updateStatus(id: number, company_id: number, data: StatusUpdateParams) {
    const statusExists = await prisma.status.findUnique({ where: { id } });

    if (!statusExists) {
      throw new Error("status not found");
    }

    if(company_id != statusExists.company_id){
      throw new Error("status not update");
    }

    await prisma.status.update({
      where: { id },
      data,
    });
  }

  async getStatusByType(
  company_id: number, 
  type: "order" | "vehicle" | "invoice" | "purchase_order"
) {
  return await prisma.status.findMany({
    where: { company_id, type },
    select: {
      id: true,
      name: true,
      type: true,
      is_default: true,
    },
  });
}

}
