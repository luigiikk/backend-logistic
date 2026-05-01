import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerOrderByCompanyService } from "@/services/order/registerOrderByCompany.js";

export const orderRegisterByCompanyBodySchema = z.object({
  vehicle_id: z.number().optional(),

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
        height: z.number(),
        width: z.number(),
        depth: z.number(),
      }),
    )
    .min(1, "A ordem precisa ter ao menos um produto"),
});

type RegisterBody = z.infer<typeof orderRegisterByCompanyBodySchema>;

export async function registerOrderByCompany(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    recipient,
    products,
    vehicle_id
  } = request.body;

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    await registerOrderByCompanyService({
      company_id,
      vehicle_id,
      recipient,
      products,
    });
  } catch (error) {
  console.error(error); 
  return reply.status(409).send({
    message: error instanceof Error ? error.message : "Unknown error"
  });
}

  return reply.status(201).send(null);
}
