import { pgTable, uuid, date, numeric } from "drizzle-orm/pg-core";
import { id, createdAt} from "../schemaHelpers";
import { RecipesTable } from "./recipes";
import { TasksTable } from "./tasks";

export const ProducedTable = pgTable('produced', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  taskId: uuid('task_id').references(() => TasksTable.id), // можно сделать и без задачи
  date: date('date').notNull(),
  portions: numeric().notNull(), // сколько порций изготовлено
  createdAt,
});
