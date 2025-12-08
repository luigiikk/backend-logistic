import { deleteWarehouseService } from "@/services/warehouses/deleteWarehouse.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteWarehouse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  await request.jwtVerify();
  const company_id = Number(request.user.sub);

  if (request.user.role !== "company") {
    return reply.status(409).send();
  }

  try {
    await deleteWarehouseService(Number(id), company_id);

    return reply.status(200).send({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not delete warehouse." });
  }
}