import { pgTable, uuid, date, numeric } from "drizzle-orm/pg-core";
import { id, createdAt } from "../schemaHelpers"
import { ProducedTable } from "./produced";

export const SalesTable = pgTable('sales', {
  id,
  producedId: uuid('produced_id').references(() => ProducedTable.id).notNull(),
  date: date('date').notNull(),
  quantity: numeric().notNull(),
  createdAt
})
