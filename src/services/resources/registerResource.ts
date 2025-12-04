import { prisma } from "@/lib/prisma.js";
import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { hash } from "bcryptjs";
import { generateEnrollmentNumber } from "@/util/generateEnrollmentNumber.js";
import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";
import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";

interface CategoryResourceBodySchema {
  name: string;
  description: string,
  quantity: number,
  category_id: number
}

export async function registerResourceService({
  name,
  description,
  quantity,
  category_id
}: CategoryResourceBodySchema) {

  const resourceRepository = new PrismaResourceRepository();

  const category = await prisma.category_Resource.findUnique(
    {
      where: {
        id: category_id,
      }
    }
  )

  if(!category){
    throw new Error("Category not exists");
  }

  const resource = await resourceRepository.create({name, description, quantity, category: { connect: { id: category.id } }})

  return resource;
}
