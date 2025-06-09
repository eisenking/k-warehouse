ALTER TABLE "ingredients" RENAME COLUMN "quantity" TO "quantity_gross";--> statement-breakpoint
ALTER TABLE "ingredients" ADD COLUMN "quantity_net" numeric NOT NULL;