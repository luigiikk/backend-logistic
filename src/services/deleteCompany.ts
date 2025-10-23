import { prisma } from "@/lib/prisma.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";



export async function deleteCompanieservice(id: number) {
  const company = await prisma.companies.findFirst({
    where: {
      id,
    }
  })
  
  if(!company){
    throw new Error('Company not exists');
  }

  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  try {
    await prismaCompaniesRepository.deleteCompany(company.id);
  } catch(error) {
    throw new Error("Error deleting company");
  }
  
}
