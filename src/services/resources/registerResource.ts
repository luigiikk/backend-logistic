import { prisma } from "@/lib/prisma.js";
import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";

interface CategoryResourceBodySchema {
  name: string;
  description: string,
  height: number,
  width: number,
  depth: number,
  category_id: number
}

export async function registerResourceService(company_id: number, {
  name,
  description,
  height,
  width,
  depth,
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

  const company = await prisma.companies.findUnique({
    where: {
      id: company_id
    }
  })

  if(!company){
    throw new Error('company not exists');
  }

  if(!category){
    throw new Error("Category not exists");
  }

  const resource = await resourceRepository.create({name, description, height, width, depth, company: {connect: {id: company.id}}, category: { connect: { id: category.id } }})

  return resource;
}
