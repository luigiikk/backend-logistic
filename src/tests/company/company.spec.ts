import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeAll, afterAll, expect, test, beforeEach } from "vitest";
import { registerService } from "@/services/register.js";
import { updateCompanyService } from "@/services/updateCompany.js";

describe("Company Routes", () => {
  beforeEach(async () => {
    await prisma.companies.deleteMany();
  });

  describe("Company register", () => {
    it("should create a new company", async () => {
      const company = await registerService({
        name: "Test",
        email: "test@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456",
      });

      expect(company).toHaveProperty("id");
      expect(company.name).toBe("Test");
    });

    it("should not create a new company with same email", async () => {
      await registerService({
        name: "Test",
        email: "test@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456",
      });

      await expect(
        registerService({
          name: "Test 2",
          email: "test@example.com",
          CNPJ: "1234",
          phone_number: "888888",
          password: "654321",
        })
      ).rejects.toThrow("Email already exists");
    });
  });

  describe("Update company", () => {
    it("should update a company successfully", async () => {
      const company = await registerService({
        name: "Test",
        email: "test@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456",
      });

      await updateCompanyService(company.id, {
        name: "Updated Company",
        email: "updated@example.com",
        CNPJ: "222",
        phone_number: "888888",
      });
  

    const updatedCompany = await prisma.companies.findUnique({
      where: { id: company.id },
    });
  
    expect(updatedCompany).not.toBeNull();
    expect(updatedCompany?.name).toBe("Updated Company");
    expect(updatedCompany?.email).toBe("updated@example.com");
    expect(updatedCompany?.CNPJ).toBe("222");
    expect(updatedCompany?.phone_number).toBe("888888");
    });
  });

});