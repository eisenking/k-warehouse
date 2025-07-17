'use server';

import { db } from '@/drizzle/db';
import { ProducedTable, TasksTable, RecipesTable, IngredientsTable, ProductsTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function getProducedItems(date) {
  return await db
    .select({
      produced: ProducedTable,
      recipe: RecipesTable
    })
    .from(ProducedTable)
    .innerJoin(RecipesTable, eq(ProducedTable.recipeId, RecipesTable.id))
    .where(eq(ProducedTable.date, date))
    .orderBy(ProducedTable.createdAt);
}

export async function createProducedItem(data) {
  const { recipeId, taskId, date, portions } = data;

  // Проверяем, достаточно ли ингредиентов на складе
  const recipe = await db
    .select()
    .from(RecipesTable)
    .where(eq(RecipesTable.id, recipeId))
    .then(rows => rows[0]);

  if (!recipe) {
    throw new Error('Рецепт не найден');
  }

  // Получаем все ингредиенты для рецепта
  const ingredients = await db
    .select({
      productId: IngredientsTable.productId,
      quantityNet: IngredientsTable.quantityNet,
      unit: IngredientsTable.unit
    })
    .from(IngredientsTable)
    .where(eq(IngredientsTable.recipeId, recipeId));

  // Проверяем доступность каждого ингредиента
  for (const ingredient of ingredients) {
    const product = await db
      .select()
      .from(ProductsTable)
      .where(eq(ProductsTable.id, ingredient.productId))
      .then(rows => rows[0]);

    if (!product) {
      throw new Error(`Продукт с ID ${ingredient.productId} не найден`);
    }

    const requiredQuantity = (ingredient.quantityNet * portions) / recipe.portionSize;
    if (Number(product.quantity) < requiredQuantity) {
      throw new Error(`Недостаточно ${product.name} на складе. Требуется: ${requiredQuantity} ${ingredient.unit}, доступно: ${product.quantity} ${product.unit}`);
    }
  }

  // Начинаем транзакцию
  await db.transaction(async (tx) => {
    // Создаем запись о производстве
    await tx.insert(ProducedTable).values({
      recipeId,
      taskId: taskId || null,
      date,
      portions: portions.toString()
    });

    // Списание ингредиентов со склада
    for (const ingredient of ingredients) {
      // Получаем актуальные данные о продукте внутри транзакции
      const product = await tx
        .select()
        .from(ProductsTable)
        .where(eq(ProductsTable.id, ingredient.productId))
        .then(rows => rows[0]);

      if (!product) continue;

      const requiredQuantity = (ingredient.quantityNet * portions) / recipe.portionSize;
      
      await tx
        .update(ProductsTable)
        .set({
          quantity: (Number(product.quantity) - requiredQuantity).toString(),
          updatedAt: new Date()
        })
        .where(eq(ProductsTable.id, ingredient.productId));
    }

    // Если есть taskId, помечаем задачу как выполненную
    if (taskId) {
      await tx
        .update(TasksTable)
        .set({
          status: 'done',
          updatedAt: new Date()
        })
        .where(eq(TasksTable.id, taskId));
    }
  });

  return { success: true };
}

export async function getPendingTasks() {
  return await db
    .select({
      task: TasksTable,
      recipe: RecipesTable
    })
    .from(TasksTable)
    .innerJoin(RecipesTable, eq(TasksTable.recipeId, RecipesTable.id))
    .where(eq(TasksTable.status, 'pending'))
    .orderBy(TasksTable.date);
}