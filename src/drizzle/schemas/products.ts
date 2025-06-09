import { pgTable, text, numeric } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers"

export const ProductsTable = pgTable('products', {
    id,
    type: text().notNull(),
    name: text().notNull(),
    quantity: numeric().default('0'),
    unit: text('unit').default('кг'),
    createdAt,
    updatedAt,
});