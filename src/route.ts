import z from "zod";
import type { FastifyTypedInstance } from "./types.js";

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
      body: z.object({
        name: z.string(),
      }),
      response: {
        201: z.null().describe('User created')
      }
    }
  }, async(request, reply) => {
    reply.status(201).send(null);
  })
}
