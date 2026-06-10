import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteVehicleMaintenance } from "@/http/controllers/maintenance-vehicle/deleteMaintenance.js";
import { getAllVehicleMaintenances } from "@/http/controllers/maintenance-vehicle/getAllMaintenance.js";
import { getVehicleMaintenance } from "@/http/controllers/maintenance-vehicle/getMaintenanceById.js";
import { createVehicleMaintenance, vehicleMaintenanceCreateBodySchema } from "@/http/controllers/maintenance-vehicle/registerMaintenance.js";
import { updateVehicleMaintenance, vehicleMaintenanceUpdateBodySchema } from "@/http/controllers/maintenance-vehicle/updateMaintenance.js";
import z from "zod";

export async function vehicleMaintenanceRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["vehicle-maintenances"],
        description: "Create a maintenance record for a vehicle",
        params: z.object({ vehicle_id: z.coerce.number() }),
        body: vehicleMaintenanceCreateBodySchema,
        response: {
          201: z.object({
            id: z.number(),
            type: z.string(),
            description: z.string().nullable(),
            cost: z.number().nullable(),
            mileage: z.number().nullable(),
            performed_at: z.date().nullable(),
            next_due_at: z.date().nullable(),
            performed_by: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    createVehicleMaintenance
  );

  app.get(
    "",
    {
      schema: {
        tags: ["vehicle-maintenances"],
        description: "List all maintenance records of a vehicle",
        params: z.object({ vehicle_id: z.coerce.number() }),
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              type: z.string(),
              description: z.string().nullable(),
              cost: z.number().nullable(),
              mileage: z.number().nullable(),
              performed_at: z.date().nullable(),
              next_due_at: z.date().nullable(),
              performed_by: z.string().nullable(),
              created_at: z.date(),
            })
          ),
        },
      },
    },
    getAllVehicleMaintenances
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["vehicle-maintenances"],
        description: "Get a maintenance record by id",
        params: z.object({ vehicle_id: z.coerce.number(), id: z.coerce.number() }),
        response: {
          200: z.object({
            id: z.number(),
            type: z.string(),
            description: z.string().nullable(),
            cost: z.number().nullable(),
            mileage: z.number().nullable(),
            performed_at: z.date().nullable(),
            next_due_at: z.date().nullable(),
            performed_by: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    getVehicleMaintenance
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["vehicle-maintenances"],
        description: "Update a maintenance record",
        params: z.object({ vehicle_id: z.coerce.number(), id: z.coerce.number() }),
        body: vehicleMaintenanceUpdateBodySchema,
        response: {
          200: z.object({
            id: z.number(),
            type: z.string(),
            description: z.string().nullable(),
            cost: z.number().nullable(),
            mileage: z.number().nullable(),
            performed_at: z.date().nullable(),
            next_due_at: z.date().nullable(),
            performed_by: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    updateVehicleMaintenance
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["vehicle-maintenances"],
        description: "Delete a maintenance record",
        params: z.object({ vehicle_id: z.coerce.number(), id: z.coerce.number() }),
        response: {
          200: z.string().describe("Maintenance deleted"),
        },
      },
    },
    deleteVehicleMaintenance
  );
}