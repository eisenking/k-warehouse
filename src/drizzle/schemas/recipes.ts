import { pgTable, text, numeric } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers"

export const RecipesTable = pgTable('recipes', {
  id,
  name: text().notNull(),
  type: text().notNull(),
  portionSize: numeric().default('1'),
  howTo: text('how_to').default(''),
  createdAt,
  updatedAt,
});