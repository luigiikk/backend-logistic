import { prisma } from "@/lib/prisma.js";
import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { PrismaSupplierRepository } from "@/repositories/prisma-supplier-repository.js";
import { hash } from "bcryptjs";

interface SupplierRegisterParams {
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson: string  | null | undefined;
  notes: string | null | undefined;

  company_id: number;

  street: string | null | undefined;
  number: number | null | undefined;
  complement: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  country: string | null | undefined;
  zipcode: string | null | undefined;
}

export async function registerSupplierService({
  name,
  email,
  phone,
  CNPJ,
  contactPerson,
  notes,
  company_id,
  number, 
  street, 
  complement, 
  city, 
  country, 
  state, 
  zipcode
}: SupplierRegisterParams) {
  const supplierWithSameEmail = await prisma.supplier.findUnique({
    where: {
      email,
    },
  });

  const supplierWithSameCNPJ = await prisma.supplier.findUnique({
    where: {
      CNPJ,
    },
  });

  if (supplierWithSameEmail) {
    throw new Error("Email already exists");
  }

  if (supplierWithSameCNPJ) {
    throw new Error("CNPJ already exists");
  }

  const company = await prisma.companies.findUnique({
    where: {
      id: company_id,
    }
  })

  if(!company){
    throw new Error("Company not exists");
  }

  const prismaSupplierRepository = new PrismaSupplierRepository;
  const prismaAddresRepository = new PrismaAddresRepository;

  const addres = await prismaAddresRepository.create({
    number, 
    street, 
    complement, 
    city, 
    country, 
    state, 
    zipcode
  });

  const supplier = await prismaSupplierRepository.create({
    name,
    email,
    phone,
    CNPJ,
    contactPerson,
    notes,
    company: {
      connect: {
        id: company.id,
      },
    },
    addres: {
      connect: {
        id: addres.id
      }
    }
  });

  return supplier;
}
