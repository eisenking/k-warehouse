// db/schema/productHistory.js
import { pgTable, uuid, text, integer, numeric } from 'drizzle-orm/pg-core';
import { id, createdAt } from "../schemaHelpers"
import { ProductsTable } from './products';
import { user } from "./auth";


export const productHistoryTable = pgTable('product_history', {
  id,
  productId: uuid('product_id').references(() => ProductsTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id),
  changeType: text('change_type').notNull(),
  oldQuantity: integer('old_quantity'),
  newQuantity: integer('new_quantity'),
  oldPrice: numeric('old_price'),
  newPrice: numeric('new_price'),
  createdAt,
});
