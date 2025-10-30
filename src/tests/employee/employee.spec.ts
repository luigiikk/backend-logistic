import { prisma } from "@/lib/prisma.js";
import { describe, it, beforeEach, expect } from "vitest";
import { registerEmployeeService } from "@/services/employees/registerEmployee.js";
import { getEmployeeService } from "@/services/employees/getEmployee.js";
import { getAllEmployeesService } from "@/services/employees/getAllEmployees.js";
import { updateEmployeeService } from "@/services/employees/updateEmployee.js";
import { deleteEmployeeService } from "@/services/employees/deleteEmployee.js";
import { clearDatabase } from "../helpers/db.js";

describe("Employee Services", () => {
  let companyId: number;
  let roleId: number;

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

    const role = await prisma.roles.create({ data: { name: "employee" } });
    roleId = role.id;
  });

  describe("Register employee", () => {
    it("should create a new employee successfully", async () => {
      const employee = await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      expect(employee).toHaveProperty("id");
      expect(employee.name).toBe("John Doe");
      expect(employee.company_id).toBe(companyId);
    });

    it("should throw error if email already exists", async () => {
      await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      await expect(
        registerEmployeeService({
          name: "Jane Doe",
          email: "john@test.com",
          phone_number: "888888888",
          password: "654321",
          employee_roles: roleId,
          company_id: companyId,
        })
      ).rejects.toThrow("Email already exists");
    });
  });

  describe("Get employee", () => {
    it("should get employee by id", async () => {
      const employee = await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      const found = await getEmployeeService(employee.id);
      expect(found.id).toBe(employee.id);
      expect(found.name).toBe("John Doe");
    });

    it("should throw error if employee does not exist", async () => {
      await expect(getEmployeeService(9999)).rejects.toThrow(
        "employee not found"
      );
    });
  });

  describe("Get all employees", () => {
    it("should return all employees", async () => {
      await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      await registerEmployeeService({
        name: "Jane Doe",
        email: "jane@test.com",
        phone_number: "888888888",
        password: "654321",
        employee_roles: roleId,
        company_id: companyId,
      });

      const employees = await getAllEmployeesService();
      expect(employees.length).toBe(2);
      expect(employees[0].name).toBe("John Doe");
      expect(employees[1].name).toBe("Jane Doe");
    });

    it("should return empty array if no employees exist", async () => {
      const employees = await getAllEmployeesService();
      expect(employees).toEqual([]);
    });
  });

  describe("Update employee", () => {
    it("should update employee successfully", async () => {
      const employee = await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      await updateEmployeeService(employee.id, {
        name: "John Updated",
        email: "john.updated@test.com",
        phone_number: "111111111",
        employee_roles: roleId,
      });

      const updatedEmployee = await prisma.employees.findUnique({
        where: { id: employee.id },
      });

      expect(updatedEmployee).not.toBeNull();
      expect(updatedEmployee?.name).toBe("John Updated");
      expect(updatedEmployee?.email).toBe("john.updated@test.com");
      expect(updatedEmployee?.phone_number).toBe("111111111");
      expect(updatedEmployee?.employee_roles).toBe(roleId);
    });

    it("should throw error if employee does not exist", async () => {
      await expect(
        updateEmployeeService(9999, {
          name: "Non Existent",
          email: "nonexistent@test.com",
          phone_number: "000000000",
          employee_roles: roleId,
        })
      ).rejects.toThrow("employee not found");
    });
  });

  describe("Delete employee", () => {
    it("should delete employee successfully", async () => {
      const employee = await registerEmployeeService({
        name: "John Doe",
        email: "john@test.com",
        phone_number: "999999999",
        password: "123456",
        employee_roles: roleId,
        company_id: companyId,
      });

      await deleteEmployeeService(employee.id);

      const deleted = await prisma.employees.findUnique({
        where: { id: employee.id },
      });
      expect(deleted).toBeNull();
    });

    it("should throw error if employee does not exist", async () => {
      await expect(deleteEmployeeService(9999)).rejects.toThrow(
        "employee not exists"
      );
    });
  });
});
