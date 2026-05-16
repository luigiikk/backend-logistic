import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";
import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { AppError } from "../erros/AppError.js";

export interface ClientUpdateParams {
  CNPJ: string;
  name?: string;
  email?: string;
  phone_number?: string;
  company_id: number
  
  street: string | null | undefined;
  number: number | null | undefined;
  complement: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  country: string | null | undefined;
  zipcode: string | null | undefined;
}

export async function updateClientService(id:number, {
  name,
  email,
  CNPJ,
  phone_number,
  company_id,

  street, 
  number,
  complement, 
  city, 
  country, 
  state, 
  zipcode
}: ClientUpdateParams) {
 
  const prismaClientRepository = new PrismaClientRepository();
  const prismaAddresRepository = new PrismaAddresRepository();

  const client = await prismaClientRepository.updateClient(id, company_id, {
    name,
    email,
    CNPJ,
    phone_number,
  });

  if (!client) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  if (client.addres_id) {
    const updatedAddress = await prismaAddresRepository.updateAddres(client.addres_id, {
      number,
      street,
      complement,
      city,
      country,
      state,
      zipcode,
    });

    if (!updatedAddress) {
      throw new AppError("Endereço não encontrado.", 404);
    }
  }
 
}