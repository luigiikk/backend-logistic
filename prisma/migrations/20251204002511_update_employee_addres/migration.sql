-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "addres_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
