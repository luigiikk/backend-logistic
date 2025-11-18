import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerAddresService } from "@/services/addres/registerAddres.js";

export const addresRegisterBodySchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.number().int(),
  zipcode: z.string(),
  complement: z.string(),
});

type RegisterBody = z.infer<typeof addresRegisterBodySchema>;

export async function registerAddres(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { country, state, city, street, number, zipcode, complement} = request.body;

  try {
    await registerAddresService({ country, state, city, street, number, zipcode, complement });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
