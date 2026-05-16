import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";
import { AppError } from "@/services/erros/AppError.js";

export async function getCategoryByIdService(
  id: number
) {
  const repository = new PrismaCategoryRepository();
  const category = repository.getCategoryById(id);
  
  if (!category) {
    throw new AppError(`Categoria de id ${id} não encontrado`, 404);
  }

  return category;
}