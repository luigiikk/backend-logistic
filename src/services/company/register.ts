import { prisma } from "@/lib/prisma.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { hash } from "bcryptjs";
import { AppError } from "../erros/AppError.js";

interface CompanyRegisterParams {
  CNPJ: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  street: string | null | undefined;
  number: number | null | undefined;
  complement: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  country: string | null | undefined;
  zipcode: string | null | undefined;
}

export async function registerService({
  name,
  email,
  password,
  CNPJ,
  phone_number,
  number, 
  street, 
  complement, 
  city, 
  country, 
  state, 
  zipcode
}: CompanyRegisterParams) {
  const password_hash = await hash(password, 6);

  const companyWithSameEmail = await prisma.companies.findUnique({
    where: {
      email,
    },
  });

  const companyWithSameCNPJ = await prisma.companies.findUnique({
    where: {
      CNPJ,
    },
  });

  if (companyWithSameEmail) {
    throw new AppError("Email ja existe", 404);
  }

  if (companyWithSameCNPJ) {
    throw new AppError("Cnpj ja existe", 404);
  }

  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  const company = await prismaCompaniesRepository.create({
    name,
    email,
    password_hash,
    CNPJ,
    phone_number,
  },  
  {
    number, 
    street, 
    complement, 
    city, 
    country, 
    state, 
    zipcode
  });

  if(!company){
    throw new AppError("Empresa não criada.", 500);
  }

  return company;
}
