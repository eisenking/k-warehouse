import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { ProductsTable } from "./products";
import { RecipesTable } from "./recipes";

export const IngredientsTable = pgTable('ingredients', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  productId: uuid('product_id').references(() => ProductsTable.id).notNull(),
  name: text('ingredient_name').notNull(),
  quantityGross: numeric('quantity_gross').notNull(), 
  quantityNet: numeric('quantity_net').notNull(),    
  unit: text().default('гр'),                         
});