import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

interface UpdateWarehouseParams {
  name?: string;
  street?: string;
  number?: number;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}

export class PrismaWarehousesRepository {
  
  async create(data: Prisma.WarehousesCreateInput){
    const warehouses = await prisma.warehouses.create({
      data,
    });
    return warehouses;
  }

  async getAllWarehouses(company_id: number) {
    return await prisma.warehouses.findMany({
      where: { 
        company_id 
      },
      include: { 
        addres: true 
      }
    });
  }

  async getWarehouseById(id: number) {
    return await prisma.warehouses.findUnique({
      where: { id },
      include: { addres: true }
    });
  }

  async updateWarehouse(id: number, company_id: number, data: UpdateWarehouseParams) {
    const { name, ...addressData } = data;

    const currentWarehouse = await prisma.warehouses.findUnique({
      where: { id, company_id },
      select: { addres_id: true }
    });

    if (!currentWarehouse) {
      throw new Error("Armazém não encontrado");
    }


    return await prisma.warehouses.update({
      where: { id, company_id },
      data: {
        ...(name ? { name } : {}),
        ...(currentWarehouse.addres_id && Object.values(addressData).some(v => v !== undefined) ? {
          addres: {
            update: {
              street: addressData.street,
              number: addressData.number,
              complement: addressData.complement,
              city: addressData.city,
              state: addressData.state,
              country: addressData.country,
              zipcode: addressData.zipcode
            }
          }
        } : {})
      },
      include: {
        addres: true
      }
    });
  }


  async deleteWarehouse(id: number, company_id: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Pega o ID do endereço antes de deletar
      const warehouse = await tx.warehouses.findUnique({
        where: { id, company_id },
        select: { addres_id: true }
      });

      if (!warehouse) throw new Error("Armazém não encontrado");

      // 2. Deleta o Armazém
      await tx.warehouses.delete({
        where: { id }
      });

      // 3. Se tinha endereço vinculado, deleta também da tabela 'addres'
      if (warehouse.addres_id) {
        await tx.addres.delete({
          where: { id: warehouse.addres_id }
        });
      }
    });
  }
}