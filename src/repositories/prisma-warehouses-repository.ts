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
  total_volume: number;
}

export class PrismaWarehousesRepository {
  
  async create(data: Prisma.WarehousesCreateInput){
    const warehouses = await prisma.warehouses.create({
      data,
    });
    return warehouses;
  }

 async getAllWarehouses(company_id: number) {
  const warehouses = await prisma.warehouses.findMany({
    where: { company_id },
    include: { addres: true },
  });

  const usedVolumes = await prisma.purchase_order_items.groupBy({
    by: ["warehouse_id"],
    where: { company_id },
    _sum: { volume: true },
  });

  const usedMap = new Map(
    usedVolumes.map((r) => [r.warehouse_id, r._sum.volume ?? 0])
  );

  return warehouses.map((w) => {
    const used = usedMap.get(w.id) ?? 0;
    const total = w.total_volume ?? 0;

    return {
      ...w,
      used_volume: used,
      available_volume: total - used,
    };
  });
}

  async getWarehouseById(id: number, company_id: number) {
  return await prisma.warehouses.findUnique({
    where: { id, company_id },
    include: { addres: true },
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
        ...(data.total_volume ? { total_volume: data.total_volume } : {}),
        ...(Object.values(addressData).some((v) => v !== undefined)
          ? {
              addres: currentWarehouse.addres_id
                ? { update: { ...addressData } }
                : { create: { ...addressData } },
            }
          : {}),
      },
      include: {
        addres: true,
      },
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