import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import { register, userRegisterBodySchema } from "./http/controllers/register.js";

export async function routes(app: FastifyTypedInstance) {
  app.get("/users", {
    schema: {
      tags: ['users'],
      description: 'List users',
      response: {
        200: z.array(z.object({
          name: z.string()
        }))
      }
    }
  }, () => {
    return [];
  });

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
}
