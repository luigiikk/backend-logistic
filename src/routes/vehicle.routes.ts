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
          id: z.number(),
          plate: z.string(),
          model: z.string().nullable(),
          total_volume: z.number(),
          status_id: z.number(),
          company_id: z.number(),
          created_at: z.date(),
          updated_at: z.date(),
          status: z.object({
            id: z.number(),
            name: z.string(),
            type: z.string(),
            is_default: z.boolean(),
            company_id: z.number().nullable(),
          }),
          documents: z.array(z.object({
            id: z.number(),
            type: z.string(),
            number: z.string().nullable(),
            issued_at: z.date().nullable(),
            expires_at: z.date().nullable(),
            file_url: z.string().nullable(),
            notes: z.string().nullable(),
            created_at: z.date(),
            updated_at: z.date(),
            vehicle_id: z.number(),
          })),
          maintenances: z.array(z.object({
            id: z.number(),
            type: z.string(),
            description: z.string().nullable(),
            cost: z.number().nullable(),
            mileage: z.number().nullable(),
            performed_at: z.date().nullable(),
            next_due_at: z.date().nullable(),
            performed_by: z.string().nullable(),
            created_at: z.date(),
            updated_at: z.date(),
            vehicle_id: z.number(),
          })),
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
              available_volume: z.number(),
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
        201: z.object({
          id: z.number(),
          plate: z.string(),
          model: z.string().nullable(),
          total_volume: z.number(),
          status_id: z.number(),
          company_id: z.number(),
          created_at: z.date(),
          updated_at: z.date(),
          status: z.object({
            id: z.number(),
            name: z.string(),
            type: z.string(),
            is_default: z.boolean(),
            company_id: z.number().nullable(),
          }),
          documents: z.array(z.object({
            id: z.number(),
            type: z.string(),
            number: z.string().nullable(),
            issued_at: z.date().nullable(),
            expires_at: z.date().nullable(),
            file_url: z.string().nullable(),
            notes: z.string().nullable(),
            created_at: z.date(),
            updated_at: z.date(),
            vehicle_id: z.number(),
          })),
          maintenances: z.array(z.object({
            id: z.number(),
            type: z.string(),
            description: z.string().nullable(),
            cost: z.number().nullable(),
            mileage: z.number().nullable(),
            performed_at: z.date().nullable(),
            next_due_at: z.date().nullable(),
            performed_by: z.string().nullable(),
            created_at: z.date(),
            updated_at: z.date(),
            vehicle_id: z.number(),
          })),
        }),
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
          status_id: z.number().int().optional(),
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