import { prisma } from "@/lib/prisma.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { hash } from "bcryptjs";
import { registerAddresService, AddresRegisterParams } from "../addres/registerAddres.js";

interface ClientRegisterParams {
  name: string;
  CNPJ: string; 
  email: string;
  phone_number: string;
  password: string;
  company_id: number;
  addressData: AddresRegisterParams;
}

export async function registerClientService({
  name,
  CNPJ, 
  email,
  phone_number,
  password,
  company_id,
  addressData,
}: ClientRegisterParams) {

  const password_hash = await hash(password, 6);
  
  const clientWithSameEmail = await prisma.client.findUnique({
    where: {
      email,
      company_id
    },
  });

  const clientWithSameCNPJ = await prisma.client.findUnique({
    where: {
      CNPJ,
      company_id
    },
  });

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
    CNPJ, 
    email,
    phone_number,
    password_hash,
    company: {
      connect: {
        id: company_id,
      },
    },
    addres: { connect: { id: addres_id } },
   })
   return client;
}