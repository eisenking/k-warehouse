'use server'
import { db } from '@/drizzle/db';
import { productHistoryTable, ProductsTable } from '@/drizzle/schema';
import { eq, ilike } from 'drizzle-orm';

export async function getProducts() {
  const result = await db.select().from(ProductsTable).orderBy(ProductsTable.createdAt);
  return result;
}

export async function addProduct(data) {
  try {
    console.log('Adding product with data:', data)
    
    const { 
      name, 
      type, 
      quantity, 
      unit, 
      price,
      userId,
      itemAmount,
      totalAmount
    } = data

    // Проверяем существующий товар
    const existingProducts = await db
      .select()
      .from(ProductsTable)
      .where(eq(ProductsTable.name, name))
      .limit(1)

    if (existingProducts.length > 0) {
      // Обновляем существующий товар
      const existing = existingProducts[0]
      console.log('Updating existing product:', existing.id)

      const newQuantity = Number(existing.quantity) + Number(quantity)
      
      // Рассчитываем среднюю цену
      const existingTotalValue = Number(existing.price) * Number(existing.quantity)
      const newTotalValue = Number(price) * Number(quantity)
      const averagePrice = ((existingTotalValue + newTotalValue) / (Number(existing.quantity) + Number(quantity))).toFixed(2)

      // Подготовка данных для обновления
      const updateData = {
        quantity: newQuantity.toString(),
        price: averagePrice,
        updatedAt: new Date()
      }

      // Обновляем данные о весе для штучных товаров
      if (unit === 'шт') {
        // Если добавляем штучный товар с указанием веса
        if (itemAmount) {
          // Если у существующего товара уже был вес, пересчитываем средний вес единицы
          if (existing.weightPerUnit) {
            const existingTotalWeight = Number(existing.weightPerUnit) * Number(existing.quantity)
            const newTotalWeight = Number(itemAmount) * Number(quantity)
            const averageWeightPerUnit = ((existingTotalWeight + newTotalWeight) / newQuantity).toFixed(3)
            
            updateData.weightPerUnit = averageWeightPerUnit
            updateData.totalWeight = (Number(averageWeightPerUnit) * newQuantity).toFixed(3)
          } else {
            // Если у существующего не было веса, используем вес из нового добавления
            updateData.weightPerUnit = itemAmount.toString()
            updateData.totalWeight = totalAmount.toString()
          }
        } else if (existing.weightPerUnit) {
          // Если вес не указан в новом добавлении, но был у существующего - пересчитываем общий вес
          updateData.totalWeight = (Number(existing.weightPerUnit) * newQuantity).toFixed(3)
        }
      } else {
        updateData.totalWeight = newQuantity.toString();
      }

      await db
        .update(ProductsTable)
        .set(updateData)
        .where(eq(ProductsTable.id, existing.id))

      // Логируем изменение
      await db.insert(productHistoryTable).values({
        productId: existing.id,
        userId,
        changeType: 'update',
        oldQuantity: existing.quantity,
        newQuantity: newQuantity.toString(),
        oldPrice: existing.price,
        newPrice: averagePrice,
        oldWeightPerUnit: existing.weightPerUnit,
        newWeightPerUnit: updateData.weightPerUnit,
        oldTotalWeight: existing.totalWeight,
        newTotalWeight: updateData.totalWeight
      })

      return { status: 'updated' }
    } else {
      // Создаем новый товар
      const insertData = {
        name,
        type,
        quantity: quantity.toString(),
        unit,
        price: price.toString(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Добавляем данные о весе если товар штучный
      if (unit === 'шт' && itemAmount) {
        insertData.weightPerUnit = itemAmount.toString()
        insertData.totalWeight = totalAmount.toString()
      } else {
        insertData.totalWeight = totalAmount.toString();
      }

      const [newProduct] = await db
        .insert(ProductsTable)
        .values(insertData)
        .returning()

      console.log('Created new product:', newProduct.id)

      // Логируем создание
      await db.insert(productHistoryTable).values({
        productId: newProduct.id,
        userId,
        changeType: 'create',
        newQuantity: newProduct.quantity,
        newPrice: newProduct.price,
        newWeightPerUnit: newProduct.weightPerUnit,
        newTotalWeight: newProduct.totalWeight
      })

      return { status: 'created' }
    }
  } catch (error) {
    console.error('Error in addProduct:', error)
    throw new Error('Failed to add product: ' + error.message)
  }
}

export async function updateProduct(id, data) {
  await db.update(ProductsTable).set(data).where(eq(ProductsTable.id, id));
}

export async function deleteProduct(id) {
  await db.delete(ProductsTable).where(eq(ProductsTable.id, id));
}


export async function getProductSuggestions(query) {
  if (!query) return []
  return await db
    .select()
    .from(ProductsTable)
    .where(ilike(ProductsTable.name, `${query}%`))
    .limit(5)
}