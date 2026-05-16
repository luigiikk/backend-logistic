import { PrismaClientRepository } from "@/repositories/prisma-client-repository.js";
import { AppError } from "../erros/AppError.js";

export async function getAllClientsService(company_id: number) {
  const prismaClientRepository = new PrismaClientRepository();

  const clients = await prismaClientRepository.getAllClients(company_id);

  if(!clients){
    throw new AppError("Nenhuma cliente encontrada.", 404);
  }

  return clients;
}