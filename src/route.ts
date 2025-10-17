import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import { register, userRegisterBodySchema } from "./http/controllers/register.js";
import { getAllUsers } from "./http/controllers/getAllUser.js";
import { deleteUser } from "./http/controllers/deleteUser.js";
import { getUser } from "./http/controllers/getUser.js";
import { updateUser, userUpdateBodySchema } from "./http/controllers/updateUser.js";

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

  app.get('/user/:id', {
    schema: {
      tags: ['users'],
      description: 'List unique user by id',
      params: z.object({
        id:  z.coerce.number()
      }),
      response: {
        200: z.object({
          enrollment: z.string(),
          name: z.string(),
          email: z.email(),
          phone_number: z.string(),
        })
      }
    }
  }, getUser);
  
  app.post('/user', {
    schema: {
      tags: ['users'],
      description: 'Create new user',
      body: userRegisterBodySchema,
      response: {
        201: z.null().describe('User created')
      }
    }
  }, register)

  app.delete('/user/:id', {
    schema: {
      tags: ['users'],
      description: 'Delete user by id',
      params: z.object({
        id:  z.coerce.number()
      }),
      response: {
        200: z.string(),
      }
    }
  }, deleteUser)

  app.put('/user/:id', {
    schema: {
      tags: ['users'],
      description: 'Update user',
      params: z.object({
        id:  z.coerce.number()
      }),
      body: userUpdateBodySchema,
      response: {
        204: z.null().describe('User Updated')
      }      
    }
  }, updateUser)
}
