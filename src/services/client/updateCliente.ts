import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";

export interface ClientUpdateParams {
  CNPJ: string;
  name?: string;
  email?: string;
  phone_number?: string;
  CPF: string;
  addres_id?: number;
  client_roles?: number;
}

export async function updateClientService(id:number, {
  name,
  email,
  CNPJ,
  phone_number,
  CPF,
  addres_id,
  client_roles,
  
}: ClientUpdateParams) {
 
  const prismaClientRepository = new PrismaClientRepository;

  await prismaClientRepository.updateClient(id, {
    name,
    email,
    CNPJ,
    phone_number,
    CPF,
    addres_id,
    client_roles,
  });
}