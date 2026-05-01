import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteVehicle } from "@/http/controllers/vehicle/deleteVehicle.js";
import { getAllVehiclesByCompany } from "@/http/controllers/vehicle/getAllVehiclesByCompany.js";
import { getVehicle } from "@/http/controllers/vehicle/getVehicle.js";
import { registerVehicle, vehicleRegisterBodySchema } from "@/http/controllers/vehicle/registerVehicle.js";
import { updateVehicle } from "@/http/controllers/vehicle/updateVehicle.js";
import z from "zod";



export async function vehicleRoutes(app: FastifyTypedInstance) {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["vehicle"],
        description: "Get vehicle by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            plate: z.string(),
            model: z.string(),
            total_volume: z.number().positive(),
            status: z.string(),
          }),
        },
      },
    },
    getVehicle
  );
  
  app.get(
    "",
    {
      schema: {
        tags: ["vehicle"],
        description: "List all vehicles",
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              plate: z.string(),
              model: z.string(),
              total_volume: z.number().positive(),
              status: z.string(),
            })
          ),
        },
      },
    },
    getAllVehiclesByCompany
  );
  
  app.post(
    "",
    {
     schema: {
          tags: ["vehicle"],
          description: "Create new vehicle",
          body: vehicleRegisterBodySchema,
          response: {
            201: z.null().describe("Vehicle created"),
          },
        },
      },
      registerVehicle
    );
  
  app.put(
    "/:id",
    {
      schema: {
        tags: ["vehicle"],
        description: "Update vehicle info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: z.object({
          plate: z.string(),
          model: z.string(),
          total_volume: z.coerce.number().positive(),
          status_id: z.number().int(),
        }),
        response: {
          204: z.null().describe("Vehicle updated"),
        },
      },
    },
    updateVehicle
  );
  
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["vehicle"],
        description: "Delete vehicle by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Vehicle deleted"),
        },
      },
    },
    deleteVehicle
  );
}