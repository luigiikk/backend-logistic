import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error.js";


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
    throw new InvalidCredentialsError();
  }

  const doesPasswordMatches = await compare(password, company.password_hash);

  if(!doesPasswordMatches){
    throw new  InvalidCredentialsError();
  }

  return company;
}
