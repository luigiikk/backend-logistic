import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerOrderByClientService } from "@/services/order/registerOrder.js";

export const orderRegisterByClientBodySchema = z.object({
  company_id: z.number().int(),

  recipient: z.object({
    name: z.string(),
    cpf: z.string(),
    email: z.string().email(),

    address: z.object({
      street: z.string().nullable().optional(),
      number: z.number().nullable().optional(),
      complement: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      state: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      zipcode: z.string().nullable().optional(),
    }),
  }),

  products: z
    .array(
      z.object({
        name: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        quantity: z.number().int().nullable().optional(),
      })
    )
    .min(1, "A ordem precisa ter ao menos um produto"),
});

type RegisterBody = z.infer<typeof orderRegisterByClientBodySchema>;

export async function registerOrderByClient(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    company_id,
    recipient,
    products,
  } = request.body;

  await request.jwtVerify();
  const sender_client_id = request.user.sub;

  try {
    await registerOrderByClientService({
      sender_client_id,
      company_id,
      recipient,
      products,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
