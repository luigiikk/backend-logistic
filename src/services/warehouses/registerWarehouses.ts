import { prisma } from "@/lib/prisma.js";
import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { hash } from "bcryptjs";
import { generateEnrollmentNumber } from "@/util/generateEnrollmentNumber.js";
import { PrismaCategoryRepository } from "@/repositories/prisma-category-respository.js";
import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";
import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";
import { PrismaWarehousesRepository } from "@/repositories/prisma-warehouses-repository.js";

interface warehousesBodySchema {
  name: string;
  street:     string,
  number:    number,
  complement: string,
  city: string,
  state: string,
  country: string,
  zipcode: string,
  total_volume: number,
}

export async function warehousesResourceService(company_id: number, {
  name,
  street,
  number,
  complement,
  city,
  state,
  country,
  zipcode,
  total_volume,
}: warehousesBodySchema) {

  const warehousesRepository = new PrismaWarehousesRepository();
  const addresRepository = new PrismaAddresRepository();

  const addres = await addresRepository.create({street, number, complement, city, state, country, zipcode});

  const company = await prisma.companies.findUnique({
    where: {
      id: company_id
    }
  })

  if(!company){
    throw new Error('company not exists');
  }

  const warehouses = await warehousesRepository.create({
    name,
    addres: { connect: { id: addres.id } },
    company: {connect: {id: company.id}},
    total_volume,
  });

  return warehouses;
}
