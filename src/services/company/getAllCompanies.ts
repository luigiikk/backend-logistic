import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";




export async function getAllCompaniesService() {
  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  const companies = await prismaCompaniesRepository.getAllCompanies();

  return companies;
}
