import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeAll, afterAll, expect, test, beforeEach } from "vitest";
import { clearDatabase } from "../helpers/db.js";
import { registerClientService } from "@/services/client/registerClient.js"
import { authClientService } from "@/services/client/authClient.js";
import { updateClientService } from "@/services/client/updateCliente.js";
import { getClientService } from "@/services/client/getClient.js";
import { getAllClientsService } from "@/services/client/getAllClient.js"; 
import { deleteClientService } from "@/services/client/deleteClient.js";


describe("Client Services", () => {
  let roleId: number;

  beforeEach(async () => {
    
    await clearDatabase();

    const role = await prisma.roles.create({
      data: {
        name: "Test Role",
      },
    });
    roleId = role.id;
  });

  describe("Client register", () => {
    it("should create a new client successfully", async () => {
        
        const client = await registerClientService({
        name: "Test Client",
        email: "client@test.com",
        CPF: "111.111.111-11",
        CNPJ: "11.111.111/0001-11",
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

      expect(client).toHaveProperty("id");
      expect(client.name).toBe("Test Client");
      expect(client.email).toBe("client@test.com");
    });

    it("should not create a client with same email", async () => {
      
      await registerClientService({
        name: "Test Client 1",
        email: "duplicate@test.com",
        CPF: "111.111.111-11",
        CNPJ: "11.111.111/0001-11",
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

      await expect(
        registerClientService({
          name: "Test Client 2",
          email: "duplicate@test.com", 
          CPF: "222.222.222-22",
          CNPJ: "11.111.111/0001-11",
          phone_number: "1234",
          password: "123456",
          client_roles: roleId,
          addres_id: null,
        })
      ).rejects.toThrow("Email already exists");
    });

    it("should not create a client with same CPF", async () => {
      await registerClientService({
        name: "Test Client 1",
        email: "client1@test.com",
        CPF: "111.111.111-11", 
        CNPJ: "11.111.111/0001-11",
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

    
      await expect(
        registerClientService({
          name: "Test Client 2",
          email: "client2test@gamail.com",
          CPF: "111.111.111-11", 
          CNPJ: "11.111.111/0001-11",
          phone_number: "888888",
          password: "654321",
          client_roles: roleId,
          addres_id: null,
        })
      ).rejects.toThrow("CPF already exists");
    });

    it("should not create a client with same CNPJ", async () => {
      await registerClientService({
        name: "Test Client 1",
        email: "client1@test.com",
        CPF: "113.111.111-11",
        CNPJ: "11.111.111/0001-11", 
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

      await expect(
        registerClientService({
          name: "Test Client 2",
          email: "client2@test.com",
          CPF: "111.111.111-11",
          CNPJ: "11.111.111/0001-11",
          phone_number: "888888",
          password: "654321",
          client_roles: roleId,
          addres_id: null,
        })
      ).rejects.toThrow("CNPJ already exists");
    });

     it("should throw an error if role does not exist", async () => {
      await expect(
        registerClientService({
          name: "Test Client",
          email: "client@test.com",
          CPF: "111.111.111-11",
          CNPJ:"11.111.111/0001-11",
          phone_number: "999999",
          password: "123456",
          client_roles: 9999,
          addres_id: null,
        })
      ).rejects.toThrow("Role not found");
    });
  });

  describe("Client auth", () => {
    let clientId: number;
    let clientEmail: string | null;

   
    beforeEach(async () => {
      const client = await registerClientService({
        name: "Auth Client",
        email: "auth@test.com",
        CPF: "123.456.789-00",
        CNPJ: "12.345.698/0001-99",
        phone_number: "999999",
        password: "password123", 
        client_roles: roleId,
        addres_id: null,
      });
      clientId = client.id;
      clientEmail = client.email ;
    });

    it("should authenticate successfully with CPF", async () => {
      const { client } = await authClientService({
        CPF: "123.456.789-00", 
        CNPJ:"12.345.878/0001-99",
        password: "password123", 
      });

      expect(client.id).toBe(clientId);
      expect(client.email).toBe(clientEmail);
    });

    it("should authenticate successfully with CNPJ", async () => {
      const { client } = await authClientService({
        CPF: "123.456.789-00", 
        CNPJ: "12.345.678/5001-99", 
        password: "password123", 
      });

      expect(client.id).toBe(clientId);
      expect(client.email).toBe(clientEmail);
    });

    it("should throw error with invalid password", async () => {
      await expect(
        authClientService({
          CPF: "123.456.789-00",
          CNPJ: "12.345.678/2001-99",
          password: "wrongpassword", 
        })
      ).rejects.toThrow("Invalid Credentials"); 
    });

    it("should throw error with invalid credentials (user not found)", async () => {
      await expect(
        authClientService({
          CPF: "999.999.999-99", 
          CNPJ: "12.345.678/0021-99",
          password: "password123",
        })
      ).rejects.toThrow("Invalid Credentials");
    });
  });


  
  describe("Update client", () => {
    it("should update a client successfully", async () => {
      const client = await registerClientService({
        name: "Client To Update",
        email: "update@test.com",
        CPF: "111111",
        CNPJ: "222222",
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

      await updateClientService(client.id, {
        name: "Updated Name",
        email: "updated@email.com",
        CPF: "111111_updated",
        CNPJ: "222222",
        phone_number: "888888",
      });

      const updatedClient = await prisma.client.findUnique({
        where: { id: client.id },
      });

      expect(updatedClient).not.toBeNull();
      expect(updatedClient?.name).toBe("Updated Name");
      expect(updatedClient?.email).toBe("updated@email.com");
      expect(updatedClient?.CPF).toBe("111111_updated");
    });
  });

  describe("Get client", () => {
    it("should get a client successfully by id", async () => {
      const client = await registerClientService({
        name: "Find Me",
        email: "findme@test.com",
        CPF: "123",
        CNPJ: "456",
        phone_number: "999999",
        password: "123456",
        client_roles: roleId,
        addres_id: null,
      });

      const foundClient = await getClientService(client.id);

      expect(foundClient).not.toBeNull();
      expect(foundClient.id).toBe(client.id);
      expect(foundClient.name).toBe("Find Me");
    });

    it("should throw an error if client does not exist", async () => {
      await expect(getClientService(9999)).rejects.toThrow("Client not found");
    });
  });

  describe("Get all clients", () => {
    it("should return all clients", async () => {
      await registerClientService({
        name: "Client 1",
        email: "c1@test.com",
        CPF: "1",
        CNPJ: "12.345.678/1001-99",
        phone_number: "111",
        password: "123",
        client_roles: roleId,
        addres_id: null,
      });
      await registerClientService({
        name: "Client 2",
        email: "c2@test.com",
        CPF: "2",
        CNPJ: "12.345.678/0001-99",
        phone_number: "222",
        password: "123",
        client_roles: roleId,
        addres_id: null,
      });

      const clients = await getAllClientsService();

      expect(clients.length).toBe(2);
      expect(clients[0].name).toBe("Client 1");
      expect(clients[1].name).toBe("Client 2");
    });

    it("should return an empty array if no clients exist", async () => {
      const clients = await getAllClientsService();
      expect(clients).toEqual([]);
    });
  });

  describe("Delete client", () => {
    it("should delete a client successfully", async () => {
      const client = await registerClientService({
        name: "To Delete",
        email: "delete@test.com",
        CPF: "123",
        CNPJ: "12.345.678/0001-99",
        phone_number: "111",
        password: "123",
        client_roles: roleId,
        addres_id: null,
      });

      await deleteClientService(client.id);

      const deletedClient = await prisma.client.findUnique({ where: { id: client.id } });
      expect(deletedClient).toBeNull();
    });

    it("should throw an error if client does not exist", async () => {
      
      await expect(deleteClientService(999)).rejects.toThrow("Client not exists"); 
    });
  });
});
