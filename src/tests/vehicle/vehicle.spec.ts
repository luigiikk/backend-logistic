import { describe, it, beforeEach, expect } from "vitest";
import { prisma } from "@/lib/prisma.js";

import { registerVehicleService } from "@/services/vehicle/registerVehicle.js";
import { updateVehicleService } from "@/services/vehicle/updateVehicle.js";
import { deleteVehicleService } from "@/services/vehicle/deleteVehicle.js";
import { getVehicleService } from "@/services/vehicle/getVehicle.js";
import { getAllVehiclesService } from "@/services/vehicle/getAllVehiclesByCompany.js";

import { clearDatabase } from "../helpers/db.js";

describe("Vehicle Services", () => {
  let companyId: number;
  let statusId: number;

  beforeEach(async () => {
    await clearDatabase();

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

    const status = await prisma.status.create({
      data: {
        name: "Available",
        type: "vehicle",
        company_id: companyId,
      },
    });
    statusId = status.id;
  });

  describe("Register vehicle", () => {
    it("should create a new vehicle successfully", async () => {
      const vehicle = await registerVehicleService({
        plate: "ABC-1234",
        model: "Truck",
        capacity: 500,
        status_id: statusId,
        company_id: companyId,
      });

      expect(vehicle).toHaveProperty("id");
      expect(vehicle.plate).toBe("ABC-1234");
      expect(vehicle.model).toBe("Truck");
    });

    it("should not allow duplicate plates", async () => {
      await registerVehicleService({
        plate: "XYZ-9999",
        model: "Van",
        capacity: 250,
        status_id: statusId,
        company_id: companyId,
      });

      await expect(
        registerVehicleService({
          plate: "XYZ-9999",
          model: "Car",
          capacity: 120,
          status_id: statusId,
          company_id: companyId,
        })
      ).rejects.toThrow("Plate already exists");
    });
  });

  describe("Get vehicle", () => {
    it("should get a vehicle by id", async () => {
      const v = await registerVehicleService({
        plate: "TTT-1111",
        model: "Car",
        capacity: 150,
        status_id: statusId,
        company_id: companyId,
      });

      const found = await getVehicleService(v.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(v.id);
    });

    it("should throw error if vehicle does not exist", async () => {
      await expect(getVehicleService(9999)).rejects.toThrow("Vehicle not found");
    });
  });

  describe("Get all vehicles", () => {
    it("should return all vehicles", async () => {
      await registerVehicleService({
        plate: "AAA-0001",
        model: "Car",
        capacity: 100,
        status_id: statusId,
        company_id: companyId,
      });

      const list = await getAllVehiclesService();
      expect(list.length).toBe(1);
    });

    it("should return empty array if no vehicles", async () => {
      const list = await getAllVehiclesService();
      expect(list).toEqual([]);
    });
  });

  describe("Update vehicle", () => {
    it("should update a vehicle successfully", async () => {
      const vehicle = await registerVehicleService({
        plate: "UPD-0001",
        model: "Pickup",
        capacity: 300,
        status_id: statusId,
        company_id: companyId,
      });

      await updateVehicleService(vehicle.id, {
        plate: "UPD-9999",
        model: "Updated Model",
        capacity: 800,
        status_id: statusId,
        company_id: companyId,
      });

      const updated = await prisma.vehicles.findUnique({
        where: { id: vehicle.id },
      });

      expect(updated?.plate).toBe("UPD-9999");
      expect(updated?.model).toBe("Updated Model");
      expect(updated?.capacity).toBe(800);
    });

    it("should throw error if vehicle does not exist", async () => {
      await expect(
        updateVehicleService(9999, {
          plate: "TEST-9999",
          model: "Truck",
          capacity: 400,
          status_id: statusId,
          company_id: companyId,
        })
      ).rejects.toThrow("vehicle not found");
    });
  });

  describe("Delete vehicle", () => {
    it("should delete a vehicle successfully", async () => {
      const vehicle = await registerVehicleService({
        plate: "DEL-0007",
        model: "Moto",
        capacity: 30,
        status_id: statusId,
        company_id: companyId,
      });

      await deleteVehicleService(vehicle.id);

      const deleted = await prisma.vehicles.findUnique({
        where: { id: vehicle.id },
      });

      expect(deleted).toBeNull();
    });

    it("should throw error if vehicle does not exist", async () => {
      await expect(deleteVehicleService(999)).rejects.toThrow(
        "Vehicle not found"
      );
    });
  });
});
