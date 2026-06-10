import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export interface CreateDocumentInput {
  type: string;
  number?: string;
  issued_at?: string;
  expires_at?: string;
  file_url?: string;
  notes?: string;
}

export interface ParsedDocumentInput {
  type: string;
  number?: string;
  issued_at?: Date;
  expires_at?: Date;
  file_url?: string;
  notes?: string;
}

export class PrismaVehicleDocumentsRepository {
  async create(data: Prisma.VehicleDocumentsCreateInput) {
    const document = await prisma.vehicleDocuments.create({
      data,
    });

    return document;
  }

  async getAllByVehicle(vehicle_id: number, company_id: number) {
    const documents = await prisma.vehicleDocuments.findMany({
      where: {
        vehicle_id,
        vehicle: { company_id },
      },
      select: {
        id: true,
        type: true,
        number: true,
        issued_at: true,
        expires_at: true,
        file_url: true,
        notes: true,
        created_at: true,
      },
    });

    return documents;
  }

  async getDocument(id: number, vehicle_id: number, company_id: number) {
    const document = await prisma.vehicleDocuments.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    return document;
  }

  async updateDocument(
    id: number,
    vehicle_id: number,
    company_id: number,
    data: Prisma.VehicleDocumentsUpdateInput
  ) {
    const documentExists = await prisma.vehicleDocuments.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    if (!documentExists) {
      throw new Error("Document not found");
    }

    const updated = await prisma.vehicleDocuments.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteDocument(id: number, vehicle_id: number, company_id: number) {
    const documentExists = await prisma.vehicleDocuments.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    if (!documentExists) {
      throw new Error("Document not found");
    }

    await prisma.vehicleDocuments.delete({
      where: { id },
    });
  }
}