import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { ProductsTable } from "./products";
import { RecipesTable } from "./recipes";

export const IngredientsTable = pgTable('ingredients', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  productId: uuid('product_id').references(() => ProductsTable.id).notNull(),
  quantityGross: numeric('quantity_gross').notNull(), // Брутто
  quantityNet: numeric('quantity_net').notNull(),     // Нетто
  unit: text().default('гр'),                         // гр, мл и т.д.
});