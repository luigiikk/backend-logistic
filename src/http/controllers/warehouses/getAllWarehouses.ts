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

    const formattedData = rawData.map((item: any) => ({
      ...item,
      address: item.addres ? item.addres : null,
      addres: undefined 
    }));

    return reply.status(200).send(formattedData);
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not find warehouses." });
  }
}