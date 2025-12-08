import type { FastifyTypedInstance } from "@/@types/types.js";
import { authClient, clientAuthBodySchema } from "@/http/controllers/client/authClient.js";
import { deleteClient } from "@/http/controllers/client/deleteClient.js";
import { getAllClients } from "@/http/controllers/client/getAllClient.js";
import { getClient } from "@/http/controllers/client/getClient.js";
import { clientRegisterBodySchema, registerClient } from "@/http/controllers/client/register.Client.js";
import { clientUpdateBodySchema, updateClient } from "@/http/controllers/client/updateClient.js";
import { verifyRole } from "@/http/middleware/verifyRole.js";
import z from "zod";

export async function clientRoutes(app: FastifyTypedInstance) {
  app.post(
    "/auth",
    {
      schema: {
        tags: ["client"],
        description: "Auth client",
        body: clientAuthBodySchema,
        response: {
          200: z.object({ token: z.string() }),
        },
      },
    },
    authClient
  );

  app.post(
    "",
    {
      schema: {
        tags: ["client"],
        description: "Create new client",
        body: clientRegisterBodySchema,
        response: {
          201: z.null().describe("Client created"),
        },
      },
    },
    registerClient
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["client"],
        description: "List unique client by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            name: z.string(),
            email: z.string().email(),
            phone_number: z.string(),
  
            CPF: z.string().nullable().optional(),
            CNPJ: z.string().nullable().optional(),
  
            street: z.string().nullable().optional(),
            number: z.number().nullable().optional(),
            complement: z.string().nullable().optional(),
            city: z.string().nullable().optional(),
            state: z.string().nullable().optional(),
            country: z.string().nullable().optional(),
            zipcode: z.string().nullable().optional(),
          }),
        },
      },
    },
    getClient
  );

  app.get(
    "",
    {
      preHandler: [verifyRole(["admin", "company"])],
      schema: {
        tags: ["client"],
        description: "List all clients",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              CNPJ: z.string(),
              name: z.string(),
              email: z.string().email(),
              phone_number: z.string(),
              addres_id: z.number().int(),
              company_id: z.number().int(),
  
              addres: z.object({
                id: z.number().int(),
                street: z.string(),
                number: z.number().int(),
                complement: z.string().nullable(),
                city: z.string(),
                state: z.string(),
                country: z.string(),
                zipcode: z.string(),
              }),
            })
          ),
        },
      },
    },
    getAllClients
  );

  app.put(
    "/:id",
    {
      preHandler: [verifyRole(["admin", "client", "company"])],
      schema: {
        tags: ["client"],
        description: "Update client info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: clientUpdateBodySchema,
        response: {
          204: z.null().describe("Client updated"),
        },
      },
    },
    updateClient
  );

  app.delete(
    "/:id",
    {
      preHandler: [verifyRole(["admin", "company"])],
      schema: {
        tags: ["client"],
        description: "Delete client by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteClient
  );
}