import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";

export async function getCategoryByIdService(
  id: number
) {
  const repository = new PrismaCategoryRepository();

  return await repository.getCategoryById(id);
}