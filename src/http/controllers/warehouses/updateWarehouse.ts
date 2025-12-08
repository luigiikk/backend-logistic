import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateWarehouseService } from "@/services//warehouses/updateWarehouse.js";

export const updateWarehouseBodySchema = z.object({
  name: z.string().optional(),
  
  street: z.string().optional(),
  number: z.number().optional(), 
  complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
});

type UpdateBody = z.infer<typeof updateWarehouseBodySchema>;

export async function updateWarehouse(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateBody }>,
  reply: FastifyReply
) {
  const {
    name,
    street,
    number,
    complement,
    city,
    state,
    country,
    zipcode
  } = request.body; 

  const { id } = request.params;

  await request.jwtVerify();
  const company_id = Number(request.user.sub);

  if (request.user.role !== "company") {
    return reply.status(409).send();
  }

  try {

    const bodyData = updateWarehouseBodySchema.parse(request.body);

    await updateWarehouseService(Number(id), company_id, {
      name: bodyData.name,
      street: bodyData.street,
      number: bodyData.number,
      complement: bodyData.complement,
      city: bodyData.city,
      state: bodyData.state,
      country: bodyData.country,
      zipcode: bodyData.zipcode
    });

    return reply.status(200).send({ message: "Warehouse updated successfully" });
  } catch (error) {
    console.error(error);
    return reply.status(409).send({ message: "Error updating warehouse" });
  }
}