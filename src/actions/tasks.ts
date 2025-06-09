// // 'use server';

// // import { db } from '@/drizzle/db'; // подключение drizzle
// // import { eq } from 'drizzle-orm';
// // import { TasksTable } from '@/drizzle/schema';
// // import { RecipesTable } from '@/drizzle/schema';
// // // import { IngredientsTable } from '@/drizzle/schema';
// // // import { ProductsTable } from '@/drizzle/schema';
// // // import { ProducedTable } from '@/drizzle/schema';
// // import { revalidatePath } from 'next/cache';

// // export async function createTask({
// //   recipeId,
// //   date,
// //   portionsPlanned,
// // }: {
// //   recipeId: string;
// //   date: string;
// //   portionsPlanned: number;
// // }) {
// //   await db.insert(TasksTable).values({
// //     recipeId,
// //     date,
// //     portionsPlanned: portionsPlanned.toString(),
// //     status: 'pending',
// //   });

// //   revalidatePath('/production');
// // }

// // // Получить все задачи на дату
// // export async function getTasksByDate(date: string) {
// //   const tasks = await db
// //     .select({
// //       id: TasksTable.id,
// //       date: TasksTable.date,
// //       portionsPlanned: TasksTable.portionsPlanned,
// //       status: TasksTable.status,
// //       recipe: {
// //         id: RecipesTable.id,
// //         name: RecipesTable.name,
// //       },
// //     })
// //     .from(TasksTable)
// //     .where(eq(TasksTable.date, date))
// //     .innerJoin(RecipesTable, eq(RecipesTable.id, TasksTable.recipeId));

// //   return tasks;
// // }

// // // Выполнить задачу
// // // export async function completeTask(taskId: string) {
  
// // // }


// "use server"
// import { db } from '@/drizzle/db';
// import { TasksTable, RecipesTable } from '@/drizzle/schema';
// import { eq, sql } from "drizzle-orm"
// // import type { Task, Recipe, RequiredProduct } from "@/lib/types"

// export async function getTasks(date) {
//   try {
//     const tasks = await db
//       .select()
//       .from(TasksTable)
//       .innerJoin(RecipesTable, eq(TasksTable.recipeId, RecipesTable.id))
//       .where(eq(TasksTable.date, date))

//     return tasks.map(({ tasks, recipes }) => ({
//       ...tasks,
//       recipe: recipes,
//     }))
//   } catch (error) {
//     console.error("Database error:", error)
//     throw new Error("Failed to fetch tasks")
//   }
// }

// export async function getRecipes() {
//   try {
//     return await db.select().from(RecipesTable)
//   } catch (error) {
//     console.error("Database error:", error)
//     throw new Error("Failed to fetch recipes")
//   }
// }

// export async function createTask(data: {
//   recipeId: string
//   date: Date
//   portionsPlanned: number
// }) {
//   try {
//     const { recipeId, date, portionsPlanned } = data

//     await db.insert(TasksTable).values({
//       recipeId,
//       date: date.toISOString().split("T")[0],
//       portionsPlanned,
//       status: "pending",
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Database error:", error)
//     throw new Error("Failed to create task")
//   }
// }

// export async function getRequiredProducts(date) {
//   try {
//     // This is a complex query that:
//     // 1. Gets all tasks for the specified date
//     // 2. Joins with recipes to get recipe details
//     // 3. Joins with ingredients to get required products
//     // 4. Calculates required quantities based on portions planned
//     // 5. Joins with products to get available quantities
//     // 6. Returns the comparison between required and available

//     const result = await db.execute(sql`
//       WITH task_ingredients AS (
//         SELECT 
//           p.id,
//           p.name,
//           p.type,
//           p.unit,
//           SUM(i.quantity_net * t.portions_planned / r.portion_size) as required_quantity,
//           p.quantity as available_quantity
//         FROM 
//           tasks t
//         JOIN 
//           recipes r ON t.recipe_id = r.id
//         JOIN 
//           ingredients i ON r.id = i.recipe_id
//         JOIN 
//           products p ON i.product_id = p.id
//         WHERE 
//           t.date = ${date}
//         GROUP BY 
//           p.id, p.name, p.type, p.unit, p.quantity
//       )
//       SELECT 
//         id,
//         name,
//         type,
//         required_quantity,
//         available_quantity,
//         unit
//       FROM 
//         task_ingredients
//       ORDER BY 
//         (required_quantity > available_quantity) DESC, name ASC
//     `)

//     return result.rows.map((row) => ({
//       id: row.id,
//       name: row.name,
//       type: row.type,
//       requiredQuantity: Number.parseFloat(row.required_quantity),
//       availableQuantity: Number.parseFloat(row.available_quantity),
//       unit: row.unit,
//     }))
//   } catch (error) {
//     console.error("Database error:", error)
//     throw new Error("Failed to calculate required products")
//   }
// }


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

// export async function createTask(data) {
//   try {
//     const { recipeId, date, portionsPlanned } = data
//     const formattedDate = new Date(date).toISOString().split('T')[0]

//     console.log("Creating task with date:", formattedDate)

//     await db.insert(TasksTable).values({
//       recipeId,
//       date: formattedDate,
//       portionsPlanned: portionsPlanned.toString(),
//       status: "pending"
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Database error:", error)
//     throw new Error("Failed to create task")
//   }
// }
export async function createTask(data) {
  try {
    const { recipeId, date, portionsPlanned } = data;
    
    // Убедимся, что date - это Date объект
    // const dateObj = date instanceof Date ? date : new Date(date);
    // const formattedDate = dateObj.toISOString().split('T')[0];

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
