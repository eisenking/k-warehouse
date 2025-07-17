'use server';

import { db } from '@/drizzle/db';
import { productHistoryTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function getProductHistory(productId) {
  console.log('id---------', productId)
  return await db
    .select()
    .from(productHistoryTable)
    .where(eq(productHistoryTable.productId, productId))
    .orderBy(productHistoryTable.createdAt);
}