import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerProductService } from "@/services/products/registerProduct.js";

export const productRegisterBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.number().int(),
  height: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  length: z.coerce.number().positive(),
  order_id: z.number().int(),
});

type RegisterBody = z.infer<typeof productRegisterBodySchema>;

export async function registerProduct(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, description, quantity, height, width, length, order_id } = request.body;


  try {
    await registerProductService({ name, description, quantity, height, width, length, order_id });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
