-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "addres_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
