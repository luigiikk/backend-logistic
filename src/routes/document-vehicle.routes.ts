import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteVehicleDocument } from "@/http/controllers/documents-vehicle/deleteDocument.js";
import { getAllVehicleDocuments } from "@/http/controllers/documents-vehicle/getAllDocuments.js";
import { getVehicleDocument } from "@/http/controllers/documents-vehicle/getDocumentById.js";
import { createVehicleDocument, vehicleDocumentBodySchema } from "@/http/controllers/documents-vehicle/registerDocument.js";
import { updateVehicleDocument } from "@/http/controllers/documents-vehicle/updateDocument.js";
import z from "zod";

export async function vehicleDocumentRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["vehicle-documents"],
        description: "Create a document for a vehicle",
        params: z.object({
          vehicle_id: z.coerce.number(),
        }),
        body: vehicleDocumentBodySchema,
        response: {
          201: z.object({
            id: z.number(),
            type: z.string(),
            number: z.string().nullable(),
            issued_at: z.date().nullable(),
            expires_at: z.date().nullable(),
            file_url: z.string().nullable(),
            notes: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    createVehicleDocument
  );

  app.get(
    "",
    {
      schema: {
        tags: ["vehicle-documents"],
        description: "List all documents of a vehicle",
        params: z.object({
          vehicle_id: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              type: z.string(),
              number: z.string().nullable(),
              issued_at: z.date().nullable(),
              expires_at: z.date().nullable(),
              file_url: z.string().nullable(),
              notes: z.string().nullable(),
              created_at: z.date(),
            })
          ),
        },
      },
    },
    getAllVehicleDocuments
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["vehicle-documents"],
        description: "Get a vehicle document by id",
        params: z.object({
          vehicle_id: z.coerce.number(),
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number(),
            type: z.string(),
            number: z.string().nullable(),
            issued_at: z.date().nullable(),
            expires_at: z.date().nullable(),
            file_url: z.string().nullable(),
            notes: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    getVehicleDocument
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["vehicle-documents"],
        description: "Update a vehicle document",
        params: z.object({
          vehicle_id: z.coerce.number(),
          id: z.coerce.number(),
        }),
        body: vehicleDocumentBodySchema.partial(),
        response: {
          200: z.object({
            id: z.number(),
            type: z.string(),
            number: z.string().nullable(),
            issued_at: z.date().nullable(),
            expires_at: z.date().nullable(),
            file_url: z.string().nullable(),
            notes: z.string().nullable(),
            created_at: z.date(),
          }),
        },
      },
    },
    updateVehicleDocument
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["vehicle-documents"],
        description: "Delete a vehicle document",
        params: z.object({
          vehicle_id: z.coerce.number(),
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Document deleted"),
        },
      },
    },
    deleteVehicleDocument
  );
}