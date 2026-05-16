import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";
import { AppError } from "@/services/erros/AppError.js";

export async function getAllCategoryService() {
  const repository = new PrismaCategoryRepository();
  const categories = await repository.getAllCategory();

  if (!categories || categories.length === 0) {
    throw new AppError("Nenhuma categoria encontrada.", 404);
  }

  return categories;
}