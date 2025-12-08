import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";


export async function getAllResourceService(
  company_id: number,
) {
  const repository = new PrismaResourceRepository();

  return await repository.getAllResource(company_id);
}