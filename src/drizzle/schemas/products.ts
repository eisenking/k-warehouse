import { pgTable, text, numeric } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers"
import { user } from "./auth";

export const ProductsTable = pgTable('products', {
    id,
    type: text().notNull(),
    name: text().notNull(),
    quantity: numeric().default('0'),
    unit: text('unit').default('кг'),
    price: numeric().default('0'),
    weightPerUnit: numeric('weight_per_unit'),
    totalWeight: numeric('total_weight'),     
    userId: text('user_id').notNull().references(() => user.id),
    createdAt,
    updatedAt,
});