-- AlterTable
ALTER TABLE "status" ALTER COLUMN "company_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "order_tracking" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status_id" INTEGER,
    "location" TEXT,
    "description" TEXT,
    "estimated_delivery" TIMESTAMP(3),
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_tracking_order_id_idx" ON "order_tracking"("order_id");

-- CreateIndex
CREATE INDEX "order_tracking_status_id_idx" ON "order_tracking"("status_id");

-- AddForeignKey
ALTER TABLE "order_tracking" ADD CONSTRAINT "order_tracking_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_tracking" ADD CONSTRAINT "order_tracking_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
