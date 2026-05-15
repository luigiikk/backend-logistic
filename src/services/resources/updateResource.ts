import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";

export interface resourceUpdateParams {
  name: string;
  height: number;
  width: number;
  depth: number;
  category_id: number;
}

export async function updateResourceService(
  id: number,
  company_id: number,
  data: resourceUpdateParams
) {
  const repository = new PrismaResourceRepository();

  return await repository.updateResource(id, company_id, data)
}