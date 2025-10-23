import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";

export interface CompanyUpdateParams {
  CNPJ: string;
  name: string;
  email: string;
  phone_number: string;
}

export async function updateCompanyService(id:number, {
  name,
  email,
  CNPJ,
  phone_number,
}: CompanyUpdateParams) {
 
  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  await prismaCompaniesRepository.updateCompany(id, {
    name,
    email,
    CNPJ,
    phone_number,
  });
}
