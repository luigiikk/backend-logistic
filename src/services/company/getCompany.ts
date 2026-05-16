import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { AppError } from "../erros/AppError.js";


export async function getCompanyService(id: number) {
  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  const company = await prismaCompaniesRepository.getCompany(id);

  if(!company){
    throw new AppError('Empresa não encontrada', 404);
  }

  return company;
}
