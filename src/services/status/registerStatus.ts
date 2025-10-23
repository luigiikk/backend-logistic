import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

interface RegisterStatusParams {
  name: string;
  type: "order" | "vehicle" | "invoice" | "purchase_order";
  is_default?: boolean;
  user_id: number;
}

export async function registerStatusService({
  name,
  type,
  is_default = false,
  user_id,
}: RegisterStatusParams) {
  const prismaStatusRepository = new PrismaStatusRepository();

  if (is_default) {
    const existingDefault = await prismaStatusRepository.getDefault(
      user_id,
      type
    );

    if (existingDefault) {
      throw new Error("default status already exists");
    }
  }

  const status = await prismaStatusRepository.create({
    name,
    type,
    is_default,
    user: {
      connect: { id: user_id },
    },
  });

  return status;
}
