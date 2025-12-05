import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { PrismaSupplierRepository } from "@/repositories/prisma-supplier-repository.js";

export async function getAllSupplierByCompanyService(company_id: number) {
  const prismaSupplierRepository = new PrismaSupplierRepository();

  const supplier = await prismaSupplierRepository.getAllSupplierByCompany(company_id);

  return supplier;
}
