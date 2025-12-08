import { PrismaWarehousesRepository } from "@/repositories/prisma-warehouses-repository.js";

interface UpdateWarehouseData {
  name?: string;
  street?: string;
  number?: number;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}

export async function updateWarehouseService(
  id: number,
  company_id: number,
  data: UpdateWarehouseData
) {

  const repository = new PrismaWarehousesRepository();
  
  return await repository.updateWarehouse(id, company_id, data);
}