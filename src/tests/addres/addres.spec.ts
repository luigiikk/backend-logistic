import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { clearDatabase } from "../helpers/db.js";
import { registerAddresService } from "@/services/addres/registerAddres.js";
import { getAddresService } from "@/services/addres/getAddres.js";
import { getAllAddresService } from "@/services/addres/getAllAddres.js";
import { updateAddresService } from "@/services/addres/updateAddres.js";
import { deleteAddresService } from "@/services/addres/deleteAddres.js";

describe("Addres Services", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("Register addres", () => {
    it("should create a new addres successfully", async () => {
      const addres = await registerAddresService({
        country: "Brasil",
        state: "Bahia",
        city: "Alagoinhas",
        street: "Av. Central",
        number: 101,
        zipcode: "48000-000",
        complement: "Casa",
      });

      expect(addres).toHaveProperty("id");
      expect(addres.city).toBe("Alagoinhas");
      expect(addres.number).toBe(101);
    });
  });

  describe("Get addres", () => {
    it("should return addres by id", async () => {
      const addres = await registerAddresService({
        country: "Brasil",
        state: "Bahia",
        city: "Alagoinhas",
        street: "Av. Central",
        number: 101,
        zipcode: "48000-000",
        complement: "Casa",
      });

      const found = await getAddresService(addres.id);

      expect(found.id).toBe(addres.id);
      expect(found.city).toBe("Alagoinhas");
    });

    it("should throw error if addres does not exist", async () => {
      await expect(getAddresService(9999)).rejects.toThrow(
        "addres not found"
      );
    });
  });

  describe("Get all addres", () => {
    it("should return all addres", async () => {
      await registerAddresService({
        country: "Brasil",
        state: "Bahia",
        city: "Alagoinhas",
        street: "Rua 1",
        number: 10,
        zipcode: "48000-111",
        complement: "",
      });

      await registerAddresService({
        country: "Brasil",
        state: "SP",
        city: "São Paulo",
        street: "Av. Paulista",
        number: 2000,
        zipcode: "01000-000",
        complement: "Apto 2",
      });

      const list = await getAllAddresService();

      expect(list.length).toBe(2);
      expect(list[0].city).toBe("Alagoinhas");
      expect(list[1].city).toBe("São Paulo");
    });

    it("should return empty array if no addres exists", async () => {
      const list = await getAllAddresService();
      expect(list).toEqual([]);
    });
  });

  describe("Update addres", () => {
  it("should update addres successfully", async () => {
    const addres = await registerAddresService({
      country: "Brasil",
      state: "Bahia",
      city: "Alagoinhas",
      street: "Rua 1",
      number: 10,
      zipcode: "48000-111",
      complement: "",
    });

    await updateAddresService(addres.id, {
      country: "Brasil",
      state: "Bahia Atualizado",
      city: "Feira de Santana",
      street: "Rua Nova",
      number: 500,
      zipcode: "40000-000",
      complement: "Perto da praça",
    });

    const updated = await prisma.addres.findUnique({
      where: { id: addres.id },
    });

    expect(updated?.state).toBe("Bahia Atualizado");
    expect(updated?.city).toBe("Feira de Santana");
    expect(updated?.street).toBe("Rua Nova");
    expect(updated?.number).toBe(500);
    expect(updated?.zipcode).toBe("40000-000");
    expect(updated?.complement).toBe("Perto da praça");
  });

  it("should throw error if addres does not exist", async () => {
    await expect(
      updateAddresService(9999, {
        country: "Brasil",
        state: "Bahia",
        city: "Cidade",
        street: "Rua",
        number: 1,
        zipcode: "00000-000",
        complement: "Teste",
      })
    ).rejects.toThrow("addres not found");
  });
});

  describe("Delete addres", () => {
    it("should delete addres successfully", async () => {
      const addres = await registerAddresService({
        country: "Brasil",
        state: "Bahia",
        city: "Alagoinhas",
        street: "Rua 1",
        number: 10,
        zipcode: "48000-111",
        complement: "",
      });

      await deleteAddresService(addres.id);

      const deleted = await prisma.addres.findUnique({
        where: { id: addres.id },
      });

      expect(deleted).toBeNull();
    });

    it("should throw error if addres does not exist", async () => {
      await expect(deleteAddresService(9999)).rejects.toThrow(
        "addres not exists"
      );
    });
  });
});