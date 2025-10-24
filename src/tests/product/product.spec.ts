import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { registerProductService } from "@/services/products/registerProduct.js";
import { getProductService } from "@/services/products/getProduct.js";
import { getAllProductsService } from "@/services/products/getAllProduct.js";
import { deleteProductService } from "@/services/products/deleteProduct.js";

describe("Product Services", () => {
  let companyId: number;
  let statusId: number;
  let vehicleId: number;
  let senderClientId: number;
  let receiverClientId: number;
  let orderId: number;

  beforeEach(async () => {

    await prisma.products.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.vehicles.deleteMany();
    await prisma.status.deleteMany();
    await prisma.client.deleteMany();
    await prisma.companies.deleteMany();

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
        name: "Pending",
        type: "order",
        company_id: companyId,
      },
    });
    statusId = status.id;

    const vehicle = await prisma.vehicles.create({
      data: {
        plate: "TEST-1234",
        status_id: statusId,
        company_id: companyId,
      },
    });
    vehicleId = vehicle.id;

    const sender = await prisma.client.create({
      data: {
        name: "Sender Client",
        email: "sender@test.com",
        client_roles: 1,
        password_hash: "hash123",
      },
    });
    senderClientId = sender.id;

    const receiver = await prisma.client.create({
      data: {
        name: "Receiver Client",
        email: "receiver@test.com",
        client_roles: 1,
        password_hash: "hash123",
      },
    });
    receiverClientId = receiver.id;

    const order = await prisma.orders.create({
      data: {
        sender_client_id: senderClientId,
        receiver_client_id: receiverClientId,
        status_id: statusId,
        vehicle_id: vehicleId,
      },
    });
    orderId = order.id;
  });

  describe("registerProductService", () => {
    it("Sucesso: should create a new product", async () => {
      const product = await registerProductService({
        name: "Produto A",
        description: "Descrição A",
        quantity: 10,
        order_id: orderId,
      });

      expect(product).toHaveProperty("id");
      expect(product.name).toBe("Produto A");
    });

    it("Falha: should throw error if order_id is invalid", async () => {
      await expect(
        registerProductService({
          name: "Produto B",
          description: "Descrição B",
          quantity: 5,
          order_id: 9999,
        })
      ).rejects.toThrow();
    });

    it("Falha brutal: should not allow duplicate name + description in same order", async () => {
      await registerProductService({
        name: "Produto C",
        description: "Descrição C",
        quantity: 5,
        order_id: orderId,
      });

      await expect(
        registerProductService({
          name: "Produto C",
          description: "Descrição C",
          quantity: 5,
          order_id: orderId,
        })
      ).rejects.toThrow("Product with this name and description already exists in this order");
    });
  });

  describe("getProductService", () => {
    it("Sucesso: should get a product by id", async () => {
      const product = await registerProductService({
        name: "Produto D",
        description: "Descrição D",
        quantity: 5,
        order_id: orderId,
      });

      const found = await getProductService(product.id);
      expect(found.id).toBe(product.id);
      expect(found.name).toBe("Produto D");
    });

    it("Falha: should throw error if product does not exist", async () => {
      await expect(getProductService(9999)).rejects.toThrow("Product not found");
    });
  });

  describe("getAllProductsService", () => {
    it("Sucesso: should return all products", async () => {
      await registerProductService({
        name: "Produto E",
        description: "Descrição E",
        quantity: 3,
        order_id: orderId,
      });

      const products = await getAllProductsService();
      expect(products.length).toBe(1);
      expect(products[0].name).toBe("Produto E");
    });

    it("Falha: should return empty array if no products exist", async () => {
      const products = await getAllProductsService();
      expect(products).toEqual([]);
    });
  });

  describe("deleteProductService", () => {
    it("Sucesso: should delete a product successfully", async () => {
      const product = await registerProductService({
        name: "Produto F",
        description: "Descrição F",
        quantity: 1,
        order_id: orderId,
      });

      const deleted = await deleteProductService(product.id);
      expect(deleted.id).toBe(product.id);

      const check = await prisma.products.findUnique({ where: { id: product.id } });
      expect(check).toBeNull();
    });

    it("Falha: should throw error if product does not exist", async () => {
      await expect(deleteProductService(999)).rejects.toThrow("Product not exists");
    });
  });
});
