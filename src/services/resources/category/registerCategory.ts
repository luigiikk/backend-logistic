import { prisma } from "@/lib/prisma.js";
import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { hash } from "bcryptjs";
import { generateEnrollmentNumber } from "@/util/generateEnrollmentNumber.js";
import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";

interface CategoryRegisterBodySchema {
  name: string;
  description: string
}

export async function registerCategoryService({
  name,
  description
}: CategoryRegisterBodySchema) {

  const categoryRepository = new PrismaCategoryRepository();

  const category = await categoryRepository.create({name, description});

  return category;
}
