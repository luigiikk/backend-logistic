import { registerResourceService } from "@/services/resources/registerResource.js";
import { warehousesResourceService } from "@/services/warehouses/registerWarehouses.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const warehousesRegisterBodySchema = z.object({
  name: z.string(),
  street:     z.string(),
  number:    z.number(),
  complement: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
});

type RegisterBody = z.infer<typeof warehousesRegisterBodySchema>;

export async function warehousesRegister(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, street, number, complement, city, state, country, zipcode } = request.body;

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    await warehousesResourceService(company_id, { name, street, number, complement, city, state, country, zipcode});
  } catch (error) {
    console.log(error)
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
