ALTER TABLE "order_products" RENAME COLUMN "orderId" TO "order_id";--> statement-breakpoint
ALTER TABLE "order_products" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "totalPrice" TO "total_price";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "imagePath" TO "image_path";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "isAvaliable" TO "is_avaliable";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "isAdmin" TO "is_admin";--> statement-breakpoint
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;