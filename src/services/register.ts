import { prisma } from "@/lib/prisma.js";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";
import { hash } from "bcryptjs";

interface UserRegisterParams {
  enrollment: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export async function registerService({
  name,
  email,
  password,
  enrollment,
  phone_number,
}: UserRegisterParams) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  const userWithSameEnrollment = await prisma.users.findUnique({
    where: {
      enrollment,
    },
  });

  if (userWithSameEmail) {
    throw new Error("Email already exists");
  }

  if (userWithSameEnrollment) {
    throw new Error("Enrollment already exists");
  }

  const prismaUsersRepository = new PrismaUsersRepository;

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
    enrollment,
    phone_number,
  });
}
