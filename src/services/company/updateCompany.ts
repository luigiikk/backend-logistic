import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { AppError } from "../erros/AppError.js";

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

  const company = await prismaCompaniesRepository.updateCompany(id, {
    name,
    email,
    CNPJ,
    phone_number,
  });

  if (!company) {
    throw new AppError("Empresa não encontrada.", 404);
  }
}
