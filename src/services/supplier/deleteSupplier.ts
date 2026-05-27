import { PrismaSupplierRepository } from "@/repositories/prisma-supplier-repository.js";

export async function deleteSupplierService(id: number, company_id: number) {
  const prismaSupplierRepository = new PrismaSupplierRepository();

  await prismaSupplierRepository.deleteSupplier(id, company_id);
}