import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";


export async function getCompanyService(id: number) {
  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  const company = await prismaCompaniesRepository.getCompany(id);

  if(!company){
    throw new Error('Company not found');
  }
  return company;
}
