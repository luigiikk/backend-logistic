import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { registerInvoiceService } from "@/services/invoice/registerInvoice.js"; 
import { updateInvoiceService } from "@/services/invoice/updateInvoice.js"; 
import { deleteInvoiceService } from "@/services/invoice/deleteInvoice.js"; 
import { getInvoiceService } from "@/services/invoice/getInvoice.js"; 
import { getAllInvoicesService } from "@/services/invoice/getAllinvoice.js";

import { clearDatabase } from "../helpers/db.js";

describe("Invoice Services", () => {
  let companyId: number;
  let clientId: number;
  let recipientId: number;
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
        name: "Pending",
         type: "invoice",
        company_id: companyId,
      },
    });
    statusId = status.id;

    const role = await prisma.roles.create({ data: { name: "client" } });

const client = await prisma.client.create({
  data: {
    name: "Invoice Client",
    email: "client@test.com",
    phone_number: "111111",
    password_hash: "hash123",
    client_roles: role.id,
  },
});
clientId = client.id;

    const recipient = await prisma.recipient.create({
      data: {
        name: "Invoice Recipient",
        cpf: "12345678901",
        email: "recipient@test.com",
      },
    });
    recipientId = recipient.id;
  });

  describe("Register invoice", () => {
    it("should create a new invoice successfully", async () => {
      const invoice = await registerInvoiceService({
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 100,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 1500,
        tax_amount: 150,
        status_id: statusId,
        link_file: "invoice.pdf",
      });

      expect(invoice).toHaveProperty("id");
      expect(invoice.client_id).toBe(clientId);
      expect(invoice.recipient_id).toBe(recipientId);
      expect(invoice.invoice_number).toBe(100);
    });

    it("should throw error if client_id is invalid", async () => {
      await expect(
        registerInvoiceService({
          client_id: 9999,
          recipient_id: recipientId,
          invoice_number: 10,
          issue_date: new Date(),
          due_date: new Date(),
          total_amount: 500,
          tax_amount: 50,
          status_id: statusId,
          link_file: "error.pdf",
        })
      ).rejects.toThrow();
    });
  });

  describe("Get invoice by ID", () => {
    it("should get an invoice successfully", async () => {
      const invoice = await registerInvoiceService({
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 101,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 2000,
        tax_amount: 200,
        status_id: statusId,
        link_file: "one.pdf",
      });

      const found = await getInvoiceService(invoice.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(invoice.id);
    });

    it("should throw error if invoice does not exist", async () => {
      await expect(getInvoiceService(9999)).rejects.toThrow(
        "invoice not found"
      );
    });
  });

  describe("Get all invoices", () => {
    it("should return all invoices", async () => {
      await registerInvoiceService({
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 200,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 500,
        tax_amount: 50,
        status_id: statusId,
        link_file: "all.pdf",
      });

      const invoices = await getAllInvoicesService();
      expect(invoices.length).toBe(1);
    });

    it("should return empty array if no invoices exist", async () => {
      const invoices = await getAllInvoicesService();
      expect(invoices).toEqual([]);
    });
  });

  describe("Update invoice", () => {
    it("should update an invoice successfully", async () => {
      const invoice = await registerInvoiceService({
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 300,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 1000,
        tax_amount: 100,
        status_id: statusId,
        link_file: "update.pdf",
      });

      await updateInvoiceService(invoice.id, {
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 999,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 3000,
        tax_amount: 300,
        status_id: statusId,
        link_file: "updated.pdf",
      });

      const updated = await prisma.invoice.findUnique({
        where: { id: invoice.id },
      });

      expect(updated).not.toBeNull();
      expect(updated?.invoice_number).toBe(999);
      expect(updated?.total_amount).toBe(3000);
      expect(updated?.link_file).toBe("updated.pdf");
    });

    it("should throw error if invoice does not exist", async () => {
      await expect(
        updateInvoiceService(9999, {
          client_id: clientId,
          recipient_id: recipientId,
          invoice_number: 999,
          issue_date: new Date(),
          due_date: new Date(),
          total_amount: 3000,
          tax_amount: 300,
          status_id: statusId,
          link_file: "fail.pdf",
        })
      ).rejects.toThrow("invoice not found");
    });
  });

  describe("Delete invoice", () => {
    it("should delete an invoice successfully", async () => {
      const invoice = await registerInvoiceService({
        client_id: clientId,
        recipient_id: recipientId,
        invoice_number: 400,
        issue_date: new Date(),
        due_date: new Date(),
        total_amount: 800,
        tax_amount: 80,
        status_id: statusId,
        link_file: "delete.pdf",
      });

      await deleteInvoiceService(invoice.id);

      const deleted = await prisma.invoice.findUnique({
        where: { id: invoice.id },
      });

      expect(deleted).toBeNull();
    });

    it("should throw error if invoice does not exist", async () => {
      await expect(deleteInvoiceService(9999)).rejects.toThrow(
        "invoice not exists"
      );
    });
  });
});
