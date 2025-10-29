import { prisma } from "@/lib/prisma.js";
import type { CompanyUpdateParams } from "@/services/company/updateCompany.js";
import { Prisma } from "@prisma/client";



export class PrismaCompaniesRepository {
  async create(data: Prisma.CompaniesCreateInput){
    const company = await prisma.companies.create({
      data,
    });

    return company;
  }

  async getAllCompanies(){
    const companies = await prisma.companies.findMany();
    
    const listCompanies = companies.map(({ name, CNPJ, email, phone_number }) => ({
      name,
      CNPJ,
      email,
      phone_number
    }));

    return listCompanies;
  }
  
  async getCompany(id: number){
    const company = await prisma.companies.findUnique({
      where: {
        id,
      }
    });

    return company;
  }

  async getCompanyByCNPJ(CNPJ: string){
    const company = await prisma.companies.findUnique({
      where: {
        CNPJ,
      }
    });

    return company;
  }

  async deleteCompany(id: number){
    await prisma.companies.delete({
      where: {
        id,
      }
    })
  }

  async updateCompany(id: number, data: CompanyUpdateParams) {
    const companyExists = await prisma.companies.findUnique({ where: { id } });
    if (!companyExists) {
      throw new Error('Company not found');
    }
    await prisma.companies.update({
      where: { id }, 
      data,            
    });
  }
}