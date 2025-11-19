import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateAddresService } from "@/services/addres/updateAddres.js";

export const addresUpdateBodySchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.number().int(),
  zipcode: z.string(),
  complement: z.string(),
});

type RegisterBody = z.infer<typeof addresUpdateBodySchema>;

export async function updateAddres(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { country, state, city, street, number, zipcode, complement } = request.body;
  const { id } = request.params;

  try {
    await updateAddresService(id, {
      country,
      state,
      city,
      street,
      number,
      zipcode,
      complement,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Addres updated successfully" });
}
