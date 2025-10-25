import { prisma } from "@/lib/prisma.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

interface ClientRegisterParams {
  name?: string | null;
  CPF?: string | null;
  CNPJ?: string | null; // Adicionado
  email?: string | null;
  phone_number?: string | null;
  password_hash?: string | null;
  client_roles: number;
  addres_id?: number | null;
}

export async function registerClientService({
  name,
  CPF,
  CNPJ, // Adicionado
  email,
  phone_number,
  password_hash,
  client_roles,
  addres_id,
}: ClientRegisterParams) {
  
  // 1. Validar Role
  const roleExists = await prisma.roles.findUnique({
    where: { id: client_roles },
  });
  if (!roleExists) {
    throw new Error("Role not found");
  }

  // 2. Validar Addres (se fornecido)
  if (addres_id) {
    const addresExists = await prisma.addres.findUnique({
      where: { id: addres_id },
    });
    if (!addresExists) {
      throw new Error("Address not found");
    }
  }

  const prismaClientRepository = new PrismaClientRepository();

  await prismaClientRepository.create({
    name,
    CPF,
    CNPJ, // Adicionado
    email,
    phone_number,
    password_hash,
    role: { connect: { id: client_roles } },
    addres: addres_id ? { connect: { id: addres_id } } : undefined,
  });
}