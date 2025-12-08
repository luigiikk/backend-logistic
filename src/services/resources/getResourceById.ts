import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";


export async function getResourceByIdService(
  company_id: number,
  id: number
) {
  const repository = new PrismaResourceRepository();

  return await repository.getResourceById(company_id, id);
}