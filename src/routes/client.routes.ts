import type { FastifyTypedInstance } from "@/@types/types.js";
import { authClient, clientAuthBodySchema } from "@/http/controllers/client/authClient.js";
import { deleteClient } from "@/http/controllers/client/deleteClient.js";
import { getAllClients } from "@/http/controllers/client/getAllClient.js";
import { getClient } from "@/http/controllers/client/getClient.js";
import { clientRegisterBodySchema, registerClient } from "@/http/controllers/client/register.Client.js";
import { clientUpdateBodySchema, updateClient } from "@/http/controllers/client/updateClient.js";
import { verifyRole } from "@/http/middleware/verifyRole.js";
import { ClientSchema } from "@/schemas/cliente.schema.js";
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
          201: z.null().describe("Cliente criado com sucesso"),
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
          200: ClientSchema
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
            ClientSchema
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