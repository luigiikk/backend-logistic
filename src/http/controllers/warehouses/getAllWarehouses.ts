import { getAllWarehousesService } from "@/services/warehouses/getAllWarehouses.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllWarehouse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify();

  if (request.user.role !== "company") {
    return reply.status(409).send();
  }

  const company_id = Number(request.user.sub);

  try {
    const rawData = await getAllWarehousesService(company_id);
 
    const formattedData = rawData.map(({ addres, used_volume, total_volume, available_volume, ...rest }) => ({
  ...rest,
  address: addres ?? null,
  used_volume: used_volume ?? 0,
  available_volume: available_volume ?? 0, // ← faltava isso
  total_volume: typeof total_volume === "number" ? total_volume : null,
}));
 
    return reply.status(200).send(formattedData);
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not find warehouses." });
  }
}