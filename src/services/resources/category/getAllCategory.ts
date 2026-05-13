import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";

export async function getAllCategoryService() {
  const repository = new PrismaCategoryRepository();

  return await repository.getAllCategory();
}