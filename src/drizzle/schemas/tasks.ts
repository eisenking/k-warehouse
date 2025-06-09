import { pgTable, uuid, date, numeric, text } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { RecipesTable } from "./recipes";

export const TasksTable = pgTable('tasks', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  date: date('date').notNull(), // на какую дату запланировано
  portionsPlanned: numeric('portions_planned').notNull(), // сколько порций надо сделать
  status: text('status').default('pending'), // pending, in_progress, done
  createdAt,
  updatedAt
});
