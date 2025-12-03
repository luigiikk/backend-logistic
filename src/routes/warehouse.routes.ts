import type { FastifyTypedInstance } from "@/@types/types.js";
import { warehousesRegister, warehousesRegisterBodySchema } from "@/http/controllers/warehouses/registerWarehouses.js";
import z from "zod";



export async function warehouseRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["warehouses"],
        description: "Create new warehouses",
        body: warehousesRegisterBodySchema,
        response: {
          201: z.null().describe("Warehouses created"),
        },
      },
    },
    warehousesRegister
  );
}