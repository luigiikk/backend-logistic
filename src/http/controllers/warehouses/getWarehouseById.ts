import { getWarehouseByIdService } from "@/services/warehouses/getWarehouseById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getWarehouseById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  await request.jwtVerify();

  if (request.user.role !== "company") {
    return reply.status(409).send();
  }

  try {
    const rawItem: any = await getWarehouseByIdService(Number(id));

    if (!rawItem) {
      return reply.status(404).send({ message: "Warehouse not found" });
    }

    const formattedItem = {
      ...rawItem,
      address: rawItem.addres ? rawItem.addres : null,
      addres: undefined
    };

    return reply.status(200).send(formattedItem);
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not find warehouse." });
  }
}