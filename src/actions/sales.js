'use server'

import { db } from '@/drizzle/db'
import { ProducedTable, SalesTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function createSale({ producedId, date, quantity }) {
  const produced = await db.select().from(ProducedTable).where(eq(ProducedTable.id, producedId)).then(r => r[0])
  if (!produced) throw new Error('Production не найден')
  if (Number(produced.portions) < quantity) throw new Error('Недостаточно порций на складе')

  await db.transaction(async (tx) => {
    await tx.insert(SalesTable).values({
      producedId,
      date,
      quantity: quantity.toString(),
      createdAt: new Date()
    })
    await tx.update(ProducedTable)
      .set({ portions: (Number(produced.portions) - quantity).toString() })
      .where(eq(ProducedTable.id, producedId))
  })
}
