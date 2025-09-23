-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "enrollment" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "model" TEXT,
    "capacity" INTEGER,
    "status_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "roles_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client" (
    "id" SERIAL NOT NULL,
    "CPF" TEXT,
    "CNPJ" TEXT,
    "name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "password_hash" TEXT,
    "client_roles" INTEGER NOT NULL,
    "addres_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "sender_client_id" INTEGER NOT NULL,
    "receiver_client_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "order_id" INTEGER NOT NULL,
    "description" TEXT,
    "quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER,
    "invoice_number" INTEGER,
    "issue_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "total_amount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "status_id" INTEGER NOT NULL,
    "link_file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "quantity" INTEGER,
    "category_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category_resource" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase_order_items" (
    "id" SERIAL NOT NULL,
    "purchase_order_id" INTEGER NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "unit_price" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase_orders" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "total_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "CPF" TEXT,
    "CNPJ" TEXT,
    "contact" TEXT,
    "addres_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."warehouses" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "addres_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory" (
    "id" SERIAL NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER,
    "quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addres" (
    "id" SERIAL NOT NULL,
    "street" TEXT,
    "number" INTEGER,
    "complement" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipcode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_enrollment_key" ON "public"."users"("enrollment");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "public"."vehicles"("plate");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "public"."user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_roles_id_idx" ON "public"."user_roles"("roles_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_CPF_key" ON "public"."client"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "client_CNPJ_key" ON "public"."client"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "public"."client"("email");

-- CreateIndex
CREATE INDEX "client_client_roles_idx" ON "public"."client"("client_roles");

-- CreateIndex
CREATE INDEX "client_addres_id_idx" ON "public"."client"("addres_id");

-- CreateIndex
CREATE INDEX "orders_sender_client_id_idx" ON "public"."orders"("sender_client_id");

-- CreateIndex
CREATE INDEX "orders_receiver_client_id_idx" ON "public"."orders"("receiver_client_id");

-- CreateIndex
CREATE INDEX "orders_status_id_idx" ON "public"."orders"("status_id");

-- CreateIndex
CREATE INDEX "orders_vehicle_id_idx" ON "public"."orders"("vehicle_id");

-- CreateIndex
CREATE INDEX "products_order_id_idx" ON "public"."products"("order_id");

-- CreateIndex
CREATE INDEX "invoice_client_id_idx" ON "public"."invoice"("client_id");

-- CreateIndex
CREATE INDEX "invoice_status_id_idx" ON "public"."invoice"("status_id");

-- CreateIndex
CREATE INDEX "resources_category_id_idx" ON "public"."resources"("category_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "public"."purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_resource_id_idx" ON "public"."purchase_order_items"("resource_id");

-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "public"."purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "purchase_orders_status_id_idx" ON "public"."purchase_orders"("status_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_CPF_key" ON "public"."supplier"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_CNPJ_key" ON "public"."supplier"("CNPJ");

-- CreateIndex
CREATE INDEX "supplier_addres_id_idx" ON "public"."supplier"("addres_id");

-- CreateIndex
CREATE INDEX "warehouses_addres_id_idx" ON "public"."warehouses"("addres_id");

-- CreateIndex
CREATE INDEX "inventory_resource_id_idx" ON "public"."inventory"("resource_id");

-- CreateIndex
CREATE INDEX "inventory_warehouse_id_idx" ON "public"."inventory"("warehouse_id");

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_roles_id_fkey" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client" ADD CONSTRAINT "client_client_roles_fkey" FOREIGN KEY ("client_roles") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client" ADD CONSTRAINT "client_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_sender_client_id_fkey" FOREIGN KEY ("sender_client_id") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_receiver_client_id_fkey" FOREIGN KEY ("receiver_client_id") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category_resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_orders" ADD CONSTRAINT "purchase_orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier" ADD CONSTRAINT "supplier_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warehouses" ADD CONSTRAINT "warehouses_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
