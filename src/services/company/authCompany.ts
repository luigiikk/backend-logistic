import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error.js";
import { AppError } from "../erros/AppError.js";


interface CompanyAuthParams {
  CNPJ: string;
  password: string;
}

export async function authCompanyService({
  CNPJ,
  password,
}: CompanyAuthParams) {

  const companyRepository = new PrismaCompaniesRepository();
  const company = await companyRepository.getCompanyByCNPJ(CNPJ);

  if(!company){
    throw new AppError("Credenciais Inválidas", 404);
  }

  const doesPasswordMatches = await compare(password, company.password_hash);

  if(!doesPasswordMatches){
    throw new AppError("Credenciais Inválidas", 404);
  }

  return company;
}
