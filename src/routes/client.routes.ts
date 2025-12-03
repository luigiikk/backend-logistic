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
    "/client",
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
      preHandler: [verifyRole(["admin", "client"])],
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
            email: z.email(),
            phone_number: z.string(),
            CPF: z.string(),
            CNPJ: z.string(),
            client_roles: z.number().int(),
            addres_id: z.number().int(),
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
              name: z.string(),
              email: z.email(),
              phone_number: z.string(),
              CPF: z.string(),
              CNPJ: z.string(),
              client_roles: z.number().int(),
              addres_id: z.number().int(),
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
      preHandler: [verifyRole(["admin", "client"])],
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
      preHandler: [verifyRole(["admin"])],
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