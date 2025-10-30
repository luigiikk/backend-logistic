import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { registerStatusService } from "@/services/status/registerStatus.js";
import { getAllStatusService } from "@/services/status/getAllStatus.js";
import { getStatusService } from "@/services/status/getStatus.js";
import { deleteStatusService } from "@/services/status/deleteStatus.js";
import { updateStatusService } from "@/services/status/updateStatus.js";
import { clearDatabase } from "../helpers/db.js";

describe("Status Services", () => {
  let companyId: number;

  beforeEach(async () => {
    await clearDatabase()

    const company = await prisma.companies.create({
      data: {
        name: "Test Company",
        email: "company@test.com",
        CNPJ: "12345678901",
        phone_number: "999999999",
        password_hash: "hash123",
      },
    });
    companyId = company.id;
  });

  describe("registerStatusService", () => {
    it("Sucesso: should create a new status", async () => {
      const status = await registerStatusService({
        name: "Pending",
        type: "order",
        company_id: companyId,
      });

      expect(status).toHaveProperty("id");
      expect(status.name).toBe("Pending");
      expect(status.type).toBe("order");
    });

    it("Falha: should not allow two default statuses of same type in same company", async () => {
      await registerStatusService({
        name: "Default Status",
        type: "order",
        is_default: true,
        company_id: companyId,
      });

      await expect(
        registerStatusService({
          name: "Another Default",
          type: "order",
          is_default: true,
          company_id: companyId,
        })
      ).rejects.toThrow("default status already exists");
    });

    it("should allow multiple non-default statuses of same type", async () => {
      const s1 = await registerStatusService({
        name: "Status 1",
        type: "vehicle",
        company_id: companyId,
      });

      const s2 = await registerStatusService({
        name: "Status 2",
        type: "vehicle",
        company_id: companyId,
      });

      expect(s1.id).not.toBe(s2.id);
      expect(s1.type).toBe("vehicle");
    });
  });

  describe("getStatusService", () => {
    it("Sucesso: should get a status by id", async () => {
      const created = await registerStatusService({
        name: "Delivered",
        type: "order",
        company_id: companyId,
      });

      const found = await getStatusService(created.id);
      expect(found.id).toBe(created.id);
    });

    it("Falha: should throw error if status not found", async () => {
      await expect(getStatusService(9999)).rejects.toThrow("Status not found");
    });
  });

  describe("getAllStatusService", () => {
    it("Sucesso: should return all statuses", async () => {
      await registerStatusService({ 
        name: "Pending", 
        type: "order", 
        company_id: companyId });
        
      await registerStatusService({ 
        name: "In Progress", 
        type: "order", 
        company_id: companyId });

      const statuses = await getAllStatusService();
      expect(statuses.length).toBe(2);
    });

    it("Falha: should return empty array if no statuses exist", async () => {
      const statuses = await getAllStatusService();
      expect(statuses).toEqual([]);
    });
  });

describe("updateStatusService", () => {
  it("Sucesso: should update a status successfully", async () => {
    const status = await registerStatusService({
      name: "Pending",
      type: "order",
      company_id: companyId,
    });

    await updateStatusService(status.id, {
      name: "Updated Status",
      type: "order",
      is_default: false,
      company_id: companyId,
    });

    const updated = await prisma.status.findUnique({ where: { id: status.id } });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe("Updated Status");
    expect(updated?.type).toBe("order");
    expect(updated?.is_default).toBe(false);
  });

  it("Falha: should throw error if status does not exist", async () => {
    await expect(
      updateStatusService(9999, {
        name: "Nonexistent",
        type: "order",
        is_default: false,
        company_id: companyId,
      })
    ).rejects.toThrow("status not found");
  });
});

  describe("deleteStatusService", () => {
    it("Sucesso: should delete a status successfully", async () => {
      const created = await registerStatusService({ 
        name: "To Delete",
        type: "order", 
        company_id: companyId });

      const deleted = await deleteStatusService(created.id);

      expect(deleted.id).toBe(created.id);

      const check = await prisma.status.findUnique({ where: { id: created.id } });
      expect(check).toBeNull();
    });

    it("Falha: should throw error when deleting non-existing status", async () => {
      await expect(deleteStatusService(9999)).rejects.toThrow("Status not found");
    });
  });
});
