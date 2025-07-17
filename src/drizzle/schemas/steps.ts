import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { RecipesTable } from "./recipes";

export const RecipeStepsTable = pgTable('recipe_steps', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  stepNumber: integer('step_number').notNull(),
  description: text('description').notNull(),
  createdAt,
  updatedAt,
});