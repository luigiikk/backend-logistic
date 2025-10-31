/*
  Warnings:

  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employee_roles` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_roles_id_fkey";

-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "employee_roles" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."user_roles";

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_employee_roles_fkey" FOREIGN KEY ("employee_roles") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
