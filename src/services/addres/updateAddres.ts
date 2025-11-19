import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";

export interface AddresUpdateParams {
  country: string;
  state: string;
  city: string;
  street: string;
  number: number;
  zipcode: string;
  complement: string;
}

export async function updateAddresService(id: number, {
    country,
    state,
    city,
    street,
    number,
    zipcode,
    complement,
  }: AddresUpdateParams
) {
  const prismaAddresRepository = new PrismaAddresRepository();

  await prismaAddresRepository.updateAddres(id, {
    country,
    state,
    city,
    street,
    number,
    zipcode,
    complement,
  });
}
