'use server'

import { db } from '@/drizzle/db';
import { ProductsTable } from '@/drizzle/schema';
import { eq, ilike } from 'drizzle-orm';

export async function getProducts() {
  const result = await db.select().from(ProductsTable).orderBy(ProductsTable.createdAt);
  return result;
}

export async function addProduct(data) {
  // Проверяем, существует ли уже такой товар
  const existing = await db
    .select()
    .from(ProductsTable)
    .where(eq(ProductsTable.name, data.name))
    .limit(1)

  if (existing.length > 0) {
    // Обновляем существующий товар
    await db
      .update(ProductsTable)
      .set({
        quantity: (Number(existing[0].quantity) + Number(data.quantity)).toString(),
        updatedAt: new Date()
      })
      .where(eq(ProductsTable.id, existing[0].id))
  } else {
    // Добавляем новый товар
    await db.insert(ProductsTable).values(data)
  }
}

export async function deleteProduct(id) {
  await db.delete(ProductsTable).where(eq(ProductsTable.id, id));
}
export async function updateProduct(id, data) {
  await db.update(ProductsTable).set(data).where(eq(ProductsTable.id, id));
}

export async function getProductSuggestions(query) {
  if (!query) return []
  return await db
    .select()
    .from(ProductsTable)
    .where(ilike(ProductsTable.name, `${query}%`))
    .limit(5)
}