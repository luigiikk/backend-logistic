import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeAll, afterAll, expect, test, beforeEach } from "vitest";
import { registerService } from "@/services/register.js";
import { updateCompanyService } from "@/services/updateCompany.js";
import { getCompanyService } from "@/services/getCompany.js";
import { getAllCompaniesService } from "@/services/getAllCompanies.js";
import { deleteCompanyService } from "@/services/deleteCompany.js";
import { clearDatabase, resetDatabase } from "../helpers/db.js";

describe("Company Routes", () => {
  beforeEach(async () => {
    await clearDatabase()
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

  describe("Get company", () => {
    it("should get a company successfully by id", async () => {
      const company = await registerService({
        name: "Test Company",
        email: "test@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456",
      });
  
      const foundCompany = await getCompanyService(company.id);
  
      expect(foundCompany).not.toBeNull();
      expect(foundCompany.id).toBe(company.id);
      expect(foundCompany.name).toBe("Test Company");
      expect(foundCompany.email).toBe("test@example.com");
      expect(foundCompany.CNPJ).toBe("123");
      expect(foundCompany.phone_number).toBe("999999");
    });

    it("should throw an error if company does not exist", async () => {
      await expect(getCompanyService(9999)).rejects.toThrow("Company not found");
    });
  });

  describe("Get all company", () => {
    it("should return all companies", async () => {
      await registerService({
        name: "Company 1",
        email: "company1@example.com",
        CNPJ: "111",
        phone_number: "999111",
        password: "123456",
      });
  
      await registerService({
        name: "Company 2",
        email: "company2@example.com",
        CNPJ: "222",
        phone_number: "999222",
        password: "123456",
      });
  
      const companies = await getAllCompaniesService();
  
      expect(companies.length).toBe(2);
      expect(companies[0].name).toBe("Company 1");
      expect(companies[1].name).toBe("Company 2");
    });
  
    it("should return an empty array if no companies exist", async () => {
      const companies = await getAllCompaniesService();
  
      expect(companies).toEqual([]);
    });
  });

  describe("Get all company", () => {
    it("should delete a company successfully", async () => {
      const company = await registerService({
        name: "Company to Delete",
        email: "delete@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456",
      });
  
      await deleteCompanyService(company.id);
  
      const deletedCompany = await prisma.companies.findUnique({ where: { id: company.id } });
      expect(deletedCompany).toBeNull();
    });
  
    it("should throw an error if company does not exist", async () => {
      await expect(deleteCompanyService(999)).rejects.toThrow("Company not exists");
    });
  });
});