import { prisma } from "@/lib/prisma.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";

export interface CompanyUpdateParams {
  cnpj: string;
  name: string;
  email: string;
  phone_number: string;
}

export async function updateCompanyService(id:number, {
  name,
  email,
  cnpj,
  phone_number,
}: CompanyUpdateParams) {
 
  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  await prismaCompaniesRepository.updateCompany(id, {
    name,
    email,
    cnpj,
    phone_number,
  });
}
