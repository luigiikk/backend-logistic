import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateOrderByCompanyService } from "@/services/order/updateOrderByCompany.js";

export const orderUpdateByCompanyBodySchema = z.object({
  vehicle_id: z.number().optional(),

  status_id: z.number().optional(),

  recipient: z.object({
    name: z.string().optional(),
    cpf: z.string().optional(),
    email: z.string().email().optional(),
    address: z.object({
      street: z.string().nullable().optional(),
      number: z.number().nullable().optional(),
      complement: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      state: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      zipcode: z.string().nullable().optional(),
    }).optional(),
  }).optional(),

  products: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        quantity: z.number().int().nullable().optional(),
        height: z.number().positive(),
        width: z.number().positive(),
        length: z.number().positive(),
      })
    )
    .optional(),
});


type UpdateBody = z.infer<typeof orderUpdateByCompanyBodySchema>;

export async function updateOrderByCompany(
  request: FastifyRequest<{ Params: { orderId: number }, Body: UpdateBody }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;

  const { orderId } = request.params;
  const body = request.body;

  try {
    await updateOrderByCompanyService({
      order_id: orderId,
      company_id,
      ...body,
    });
  } catch (error) {
    console.error(error);
    return reply.status(409).send();
  }

  return reply.status(200).send(null);
}