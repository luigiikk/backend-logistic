import { prisma } from "@/lib/prisma.js";
import { PrismaCompaniesRepository } from "@/repositories/prisma-companies-repository.js";
import { hash } from "bcryptjs";

interface CompanyRegisterParams {
  CNPJ: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export async function registerService({
  name,
  email,
  password,
  CNPJ,
  phone_number,
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
    throw new Error("Email already exists");
  }

  if (companyWithSameCNPJ) {
    throw new Error("CNPJ already exists");
  }

  const prismaCompaniesRepository = new PrismaCompaniesRepository;

  const company = await prismaCompaniesRepository.create({
    name,
    email,
    password_hash,
    CNPJ,
    phone_number,
  });

  return company;
}
