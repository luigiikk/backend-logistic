import { prisma } from "@/lib/prisma.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { hash } from "bcryptjs";
import { registerAddresService, AddresRegisterParams } from "../addres/registerAddres.js";

interface ClientRegisterParams {
  name: string;
  CPF: string;
  CNPJ: string; 
  email: string;
  phone_number: string;
  password: string;
  client_roles: number;
  addressData: AddresRegisterParams;
}

export async function registerClientService({
  name,
  CPF,
  CNPJ, 
  email,
  phone_number,
  password,
  client_roles,
  addressData,
}: ClientRegisterParams) {

  const password_hash = await hash(password, 6);
  
  const roleExists = await prisma.roles.findUnique({
    where: { id: client_roles },
  });
  if (!roleExists) {
    throw new Error("Role not found");
  } 
  const clientWithSameEmail = await prisma.client.findUnique({
    where: {
      email,
    },
  });

  const clientWithSameCNPJ = await prisma.client.findUnique({
    where: {
      CNPJ,
    },
  });

  const clientWithSameCPF = await prisma.client.findUnique({
    where: {
      CPF,
    },
  });

  if (clientWithSameCPF) {
    throw new Error("CPF already exists");
  }

  if (clientWithSameEmail) {
    throw new Error("Email already exists");
  }

  if (clientWithSameCNPJ) {
    throw new Error("CNPJ already exists");
  }

  const newAddress = await registerAddresService(addressData);
  if (!newAddress) {
    throw new Error("Failed to create address");
  }
  
    const addres_id = newAddress.id;
  
  const prismaClientRepository = new PrismaClientRepository();

  const client = await prismaClientRepository.create({
    name,
    CPF,
    CNPJ, 
    email,
    phone_number,
    password_hash,
    role: { connect: { id: client_roles } },
    addres: { connect: { id: addres_id } },
   })
   return client;
    }