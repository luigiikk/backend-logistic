import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";
import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";


export async function getAllCategoryService(
  company_id: number,
) {
  const repository = new PrismaCategoryRepository();

  return await repository.getAllCategory(company_id);
}