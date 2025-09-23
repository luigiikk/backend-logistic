import { prisma } from "@/lib/prisma.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { hash } from "bcryptjs";
import z from "zod";

export const userRegisterBodySchema =  z.object({
  enrollment: z.string(),
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  password: z.string().min(6),
})

type RegisterBody = z.infer<typeof userRegisterBodySchema>;

export async function register(request: FastifyRequest<{Body: RegisterBody}>, reply: FastifyReply){

  const { name, enrollment, email, password, phone_number } = request.body;

  const password_hash = await hash(password, 6); 

  await prisma.users.create({
    data: {
      name,
      enrollment,
      password_hash,
      email,
      phone_number
    }
  });

  return reply.status(201).send(null);
}