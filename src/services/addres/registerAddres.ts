import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";

interface AddresRegisterParams {
  country: string;
  state: string;
  city: string;
  street: string;
  number: number;
  zipcode: string;
  complement: string;
}

export async function registerAddresService({
  country,
  state,
  city,
  street,
  number,
  zipcode,
  complement,
}: AddresRegisterParams) {
 
  const prismaAddresRepository = new PrismaAddresRepository;

  const addres = await prismaAddresRepository.create({
    country,
    state,
    city,
    street,
    number,
    zipcode,
    complement,
  });

  return addres;
}
