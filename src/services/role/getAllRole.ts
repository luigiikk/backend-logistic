import { PrismaRolesRepository } from "@/repositories/prisma-role-repository.js";

export async function getAllRolesService() {
  const prismaRolesRepository = new PrismaRolesRepository();

  const roles = await prismaRolesRepository.getAllRoles();

  return roles;
}
