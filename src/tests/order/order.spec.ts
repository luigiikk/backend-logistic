import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { registerOrderService } from "@/services/order/registerOrder.js";
import { getOrderService } from "@/services/order/getOrder.js";
import { getAllOrdersService } from "@/services/order/getAllOrders.js";
import { deleteOrderService } from "@/services/order/deleteOrder.js";
import { updateOrderService } from "@/services/order/updateOrder.js";
import { clearDatabase } from "../helpers/db.js";

describe("Order Services", () => {
  let companyId: number;
  let statusId: number;
  let vehicleId: number;
  let senderClientId: number;
  let recipientId: number;

  beforeEach(async () => {
    await clearDatabase();

    // Cria Company
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

    // Cria Status
    const status = await prisma.status.create({
      data: {
        name: "Pending",
        type: "order",
        company_id: companyId,
      },
    });
    statusId = status.id;

    // Cria Vehicle
    const vehicle = await prisma.vehicles.create({
      data: {
        plate: "TEST-1234",
        status_id: statusId,
        company_id: companyId,
      },
    });
    vehicleId = vehicle.id;

    // Cria Role do Sender
    const senderRole = await prisma.roles.create({ data: { name: "sender" } });

    // Cria Sender Client
    const sender = await prisma.client.create({
      data: {
        name: "Sender Client",
        email: "sender@test.com",
        client_roles: senderRole.id,
        password_hash: "hash123",
      },
    });
    senderClientId = sender.id;

    // Cria Recipient
    const recipient = await prisma.recipient.create({
      data: {
        name: "Receiver Recipient",
        cpf: "12345678901",
        email: "receiver@test.com",
      },
    });
    recipientId = recipient.id;
  });

  describe("Register order", () => {
    it("should create a new order successfully", async () => {
      const order = await registerOrderService({
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId, // necessário
      });

      expect(order).toHaveProperty("id");
      expect(order.sender_client_id).toBe(senderClientId);
      expect(order.recipient_id).toBe(recipientId);
      expect(order.company_id).toBe(companyId);
      expect(order.code).toBeDefined(); 
    });

    it("should throw error if sender_client_id is invalid", async () => {
      await expect(
        registerOrderService({
          sender_client_id: 9999,
          recipient_id: recipientId,
          status_id: statusId,
          vehicle_id: vehicleId,
          company_id: companyId,
        })
      ).rejects.toThrow();
    });
  });

  describe("Get order", () => {
    it("should get an order by id successfully", async () => {
      const order = await registerOrderService({
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId,
      });

      const foundOrder = await getOrderService(order.id);
      expect(foundOrder).not.toBeNull();
      expect(foundOrder.id).toBe(order.id);
    });

    it("should throw error if order does not exist", async () => {
      await expect(getOrderService(9999)).rejects.toThrow("order not found");
    });
  });

  describe("Get all orders", () => {
    it("should return all orders", async () => {
      await registerOrderService({
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId,
      });

      const orders = await getAllOrdersService();
      expect(orders.length).toBe(1);
    });

    it("should return empty array if no orders exist", async () => {
      const orders = await getAllOrdersService();
      expect(orders).toEqual([]);
    });
  });

  describe("Update order", () => {
    it("should update an order successfully", async () => {
      const order = await registerOrderService({
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId,
      });

      await updateOrderService(order.id, {
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId,
      });

      const updatedOrder = await prisma.orders.findUnique({
        where: { id: order.id },
      });

      expect(updatedOrder).not.toBeNull();
      expect(updatedOrder?.sender_client_id).toBe(senderClientId);
      expect(updatedOrder?.recipient_id).toBe(recipientId);
      expect(updatedOrder?.status_id).toBe(statusId);
      expect(updatedOrder?.vehicle_id).toBe(vehicleId);
      expect(updatedOrder?.company_id).toBe(companyId);
    });

    it("should throw error if order does not exist", async () => {
      await expect(
        updateOrderService(9999, {
          sender_client_id: senderClientId,
          recipient_id: recipientId,
          status_id: statusId,
          vehicle_id: vehicleId,
          company_id: companyId,
        })
      ).rejects.toThrow("order not found");
    });
  });

  describe("Delete order", () => {
    it("should delete an order successfully", async () => {
      const order = await registerOrderService({
        sender_client_id: senderClientId,
        recipient_id: recipientId,
        status_id: statusId,
        vehicle_id: vehicleId,
        company_id: companyId,
      });

      await deleteOrderService(order.id);

      const deletedOrder = await prisma.orders.findUnique({
        where: { id: order.id },
      });

      expect(deletedOrder).toBeNull();
    });

    it("should throw error if order does not exist", async () => {
      await expect(deleteOrderService(999)).rejects.toThrow("order not exists");
    });
  });
});
