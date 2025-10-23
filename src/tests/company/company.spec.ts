import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeAll, afterAll, expect, test } from "vitest";
import { registerService } from "@/services/register.js";

describe("User Routes", () => {
  beforeAll(async () => {
    await prisma.companies.deleteMany();
  });

  describe("User register", () => {
    it("should create a new user", async () => {
      const user = await registerService({
        name: "Test",
        email: "test@example.com",
        CNPJ: "123",
        phone_number: "999999",
        password: "123456"
      });
  
      expect(user).toHaveProperty("id");
      expect(user.name).toBe("Test");
    });
  })
});