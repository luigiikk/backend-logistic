import { prisma } from "@/lib/prisma.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

interface ClientRegisterParams {
  name?: string | null;
  CPF?: string | null;
  CNPJ?: string | null;
  email?: string | null;
  phone_number?: string | null;
  password_hash?: string | null;
  client_roles: number;
  addres_id?: number | null;
}

export async function registerClientService({
  name,
  CPF,
  CNPJ,
  email,
  phone_number,
  password_hash,
  client_roles,
  addres_id,
}: ClientRegisterParams) {

  // --- VALIDAÇÕES ADICIONADAS ---
  if (CPF) {
    const cpfExists = await prisma.client.findUnique({
      where: { CPF },
    });
    if (cpfExists) {
      throw new Error("CPF already registered.");
    }
  }

  if (CNPJ) {
    const cnpjExists = await prisma.client.findUnique({
      where: { CNPJ },
    });
    if (cnpjExists) {
      throw new Error("CNPJ already registered.");
    }
  }

  if (email) {
    const emailExists = await prisma.client.findUnique({
      where: { email },
    });
    if (emailExists) {
      throw new Error("Email already registered.");
    }
  }
  // --- FIM DAS VALIDAÇÕES ---

  // Validação de Role (Já existia)
  const roleExists = await prisma.roles.findUnique({
    where: { id: client_roles },
  });
  if (!roleExists) {
    throw new Error("Role not found");
  }

  // Validação de Addres (Já existia)
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
    CNPJ,
    email,
    phone_number,
    password_hash,
    role: { connect: { id: client_roles } },
    addres: addres_id ? { connect: { id: addres_id } } : undefined,
  });
}