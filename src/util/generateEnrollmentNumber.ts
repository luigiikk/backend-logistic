import { prisma } from "@/lib/prisma.js";

export async function generateEnrollmentNumber(): Promise<string> {
  let enrollment = ""; 
  let exists = true;

  while (exists) {   
    enrollment = Math.floor(100_000_000 + Math.random() * 900_000_000).toString();

    const found = await prisma.employees.findUnique({ where: { enrollment } });
    exists = found !== null; 
  }

  return enrollment;
}
