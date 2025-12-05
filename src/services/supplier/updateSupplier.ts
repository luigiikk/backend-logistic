import { prisma } from "@/lib/prisma.js";
import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { PrismaSupplierRepository } from "@/repositories/prisma-supplier-repository.js";
import { hash } from "bcryptjs";

interface SupplierUpdateParams {
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

export async function updateSupplierService(id: number, {
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
}: SupplierUpdateParams) {
  const supplier = await prisma.supplier.findUnique({
    where: { 
      id,
      company_id,
    },
    include: { addres: true }
  });
  
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  const prismaSupplierRepository = new PrismaSupplierRepository();
  const prismaAddresRepository = new PrismaAddresRepository();

  const updatedSupplier = await prismaSupplierRepository.update(id, {
    name,
    email,
    phone,
    CNPJ,
    contactPerson,
    notes,
    company: {
      connect: { id: company_id }
    }
  });

  await prismaAddresRepository.updateAddres(supplier.addres_id, {
    number,
    street,
    complement,
    city,
    country,
    state,
    zipcode
  });

  return updatedSupplier;
}
