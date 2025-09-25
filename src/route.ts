import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import { register, userRegisterBodySchema } from "./http/controllers/register.js";
import { getAllUsers } from "./http/controllers/getAllUser.js";
import { deleteUser, userDeleteBodySchema } from "./http/controllers/deleteUser.js";

export async function routes(app: FastifyTypedInstance) {
  app.get('/users', {
    schema: {
      tags: ['users'],
      description: 'List users',
      response: {
        200: z.array(z.object({
          enrollment: z.string(),
          name: z.string(),
          email: z.email(),
          phone_number: z.string(),
        }))
      }
    }
  }, getAllUsers);

  app.post('/users', {
    schema: {
      tags: ['users'],
      description: 'Create new user',
      body: userRegisterBodySchema,
      response: {
        201: z.null().describe('User created')
      }
    }
  }, register)

  app.delete('/users', {
    schema: {
      tags: ['users'],
      description: 'Delete user by id',
      body: userDeleteBodySchema,
      response: {
        200: z.string(),
      }
    }
  }, deleteUser)
}
