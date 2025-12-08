import { PrismaSupplierRepository } from "@/repositories/prisma-supplier-repository.js";

export async function getSupplierByIdService(id: number, company_id: number) {
  console.log('ola')
  const prismaSupplierRepository = new PrismaSupplierRepository();

  const supplier = await prismaSupplierRepository.getSupplierById(id, company_id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }
  return supplier;
}