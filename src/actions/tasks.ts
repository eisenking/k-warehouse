"use server"

import { db } from "@/drizzle/db"
import { TasksTable, RecipesTable, IngredientsTable, ProductsTable } from "@/drizzle/schema"
import { format } from "date-fns"
import { eq, sql, and, sum, gt } from "drizzle-orm"

export async function getTasks(date) {
  try {
    console.log("Fetching tasks for date:", date)

    const tasks = await db
      .select({
        task: TasksTable,
        recipe: RecipesTable
      })
      .from(TasksTable)
      .innerJoin(RecipesTable, eq(TasksTable.recipeId, RecipesTable.id))
      .where(eq(TasksTable.date, date))

    console.log("Found tasks:", tasks.length)

    return tasks.map(({ task, recipe }) => ({
      ...task,
      recipe: recipe
    }))
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function getRecipes() {
  try {
    return await db.select().from(RecipesTable)
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch recipes")
  }
}

export async function createTask(data) {
  try {
    const { recipeId, date, portionsPlanned } = data;

    console.log("Creating task with:", { 
      recipeId, 
      date,
      portionsPlanned 
    });

    await db.insert(TasksTable).values({
      recipeId,
      date,
      portionsPlanned: portionsPlanned.toString(),
      status: "pending"
    });

    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create task");
  }
}


export async function getRequiredProducts(date) {
  try {
    // Сначала получаем все задачи на указанную дату
    const tasks = await db
      .select()
      .from(TasksTable)
      .where(eq(TasksTable.date, date))

    if (tasks.length === 0) {
      return []
    }

    // Затем для каждой задачи получаем необходимые продукты
    const productsMap = new Map()

    for (const task of tasks) {
      const recipe = await db
        .select()
        .from(RecipesTable)
        .where(eq(RecipesTable.id, task.recipeId))
        .then(rows => rows[0])

      if (!recipe) continue

      const ingredients = await db
        .select()
        .from(IngredientsTable)
        .where(eq(IngredientsTable.recipeId, recipe.id))

      for (const ingredient of ingredients) {
        const product = await db
          .select()
          .from(ProductsTable)
          .where(eq(ProductsTable.id, ingredient.productId))
          .then(rows => rows[0])

        if (!product) continue

        const portionsRatio = task.portionsPlanned / recipe.portionSize
        const requiredQuantity = ingredient.quantityNet * portionsRatio

        if (productsMap.has(product.id)) {
          const existing = productsMap.get(product.id)
          productsMap.set(product.id, {
            ...existing,
            requiredQuantity: existing.requiredQuantity + requiredQuantity
          })
        } else {
          productsMap.set(product.id, {
            id: product.id,
            name: product.name,
            type: product.type,
            requiredQuantity: requiredQuantity,
            availableQuantity: product.quantity,
            unit: product.unit
          })
        }
      }
    }

    // Преобразуем Map в массив и сортируем
    const products = Array.from(productsMap.values())
      .map(p => ({
        ...p,
        requiredQuantity: Number(p.requiredQuantity.toFixed(2)),
        availableQuantity: Number(p.availableQuantity)
      }))
      .sort((a, b) => {
        const aMissing = a.requiredQuantity > a.availableQuantity
        const bMissing = b.requiredQuantity > b.availableQuantity
        
        if (aMissing === bMissing) {
          return a.name.localeCompare(b.name)
        }
        return aMissing ? -1 : 1
      })

    return products
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to calculate required products")
  }
}
