Привет, я делаю приложения складского учета на nextjs 15, drizzle orm, postgres db, tailwind, shadcn, betterAuth. 
Для действий я использую Next Js Server Actions
zod react-hook-forms для форм.
Все настроено и подключено.
Код пиши на Jsx, БЕЗ Typescript.

Идея приложения - 5 таблиц, связанных между собой.

1. Продукты (Products) - список товаров на складе, CRUD функционал (Например Говядина 10 кг, Картошка 20кг)
2. ТехКарты (Recipes) - список ТехКарт с раскладками, по которым происходит производство. Можно добавлять техкарты, выбирая тип блюда и добавляя имеющиеся ингредиенты со склада.
3. Задачи (Tasks) - список Задач, где мы выбираем дату и создаем задачу выбирая блюдо из ТехКарт, так же здесь рассчитываются все ингредиенты нужные для выполнения поставленных на день задач и
показывается сколько их в Продуктах.
4. Продукция (Production) - можно выбрать дату, блюдо из ТехКарт или Задач, количество порций - после создания Изготовленного блюда, продукты списываются из Продуктов. а если бралась задачи из Tasks - задача помечается выполненной.
Т.е на этой странице создается и хранятся готовый товар созданный по ТехКарте (например Говядина с картошкой запеченная 1 порция =  100 грамм говядины и 200 грамм картошки ) 
Нужно выбрать день (по умолчанию там сегодня)  и добавить произведенный товар с нужным количеством порций. Товар добавится, а из таблицы Products спишется количество затраченных продуктов. 
Нельзя создать больше порций чем позволяет количество в таблице Products.
5. Продажи (Sales) список, где можно по дням добавлять проданные товары из таблицы Production.


Твоя роль - профессиональный программист.
Помоги мне реализовать пункты 4 - Продукция

Структура приложения 

Next.js app router

 --src/
      --/actions
          produced.js (Server actions для Готовой продукции)
          products.js
          recipes.js
          tasks.ts
      --/app
        --/api (BetterAuth api)
        --/main
          --/components
            --/Warehouse (Таблица продуктов)
            --/Recipes
            --/Tasks
            --/Production
            --/Sales
          page.tsx 
          template.tsx
        layout.tsx
        page.tsx
      --/components (Shared / shadcn ui components)
      --/drizzle
        --/migrations
        --/schemas
          auth.ts
          products.ts
          recipes.ts
          ingredients.ts
          tasks.ts
          produced.ts
          sales.ts
        db.ts
        schema.ts
        schemaHelpers.ts
      --/lib
          auth-client.ts
          auth.ts
          utils.ts


Page.tsx /main

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Warehouse from "@/app/main/components/Warehouse/Warehouse";
import Recipes from "@/app/main/components/Recipes/Recipes";
import Tasks from "@/app/main/components/Tasks/Tasks";
import Production from "@/app/main/components/Production/Production";
import Sales from "@/app/main/components/Sales/Sales";

export default async function Main() {


  return (
    <section className="w-full max-w-7xl">
      <Tabs defaultValue="warehouse" className="items-center">
        <TabsList className='flex items-center justify-start flex-wrap h-auto space-y-1'>
          <TabsTrigger value="warehouse">Склад</TabsTrigger>
          <TabsTrigger value="recipes">ТехКарты</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger> 
          <TabsTrigger value="production">Производство</TabsTrigger>          
          <TabsTrigger value="sales">Продажи</TabsTrigger>
        </TabsList>
        <TabsContent value="warehouse">
          <Warehouse />
        </TabsContent>
        <TabsContent value="recipes">
          <Recipes />
        </TabsContent>
        <TabsContent value="tasks">
          <Tasks />
        </TabsContent>
        <TabsContent value="production">
          <Production />
        </TabsContent>
        <TabsContent value="sales">
          <Sales />
        </TabsContent>
      </Tabs>
    </section>
  );
}

Вот мои схемы drizzle для таблиц

Продукты

export const ProductsTable = pgTable('products', {
    id,
    type: text().notNull(),
    name: text().notNull(),
    quantity: numeric().default('0'),
    unit: text('unit').default('кг'),
    price: numeric().default('0'),
    userId: text('user_id').notNull().references(() => user.id),
    createdAt,
    updatedAt,
});

ТехКарты

export const RecipesTable = pgTable('recipes', {
  id,
  name: text().notNull(),
  type: text().notNull(),
  portionSize: numeric().default('1'),
  createdAt,
  updatedAt,
});

Ингредиенты для ТехКарт 

export const IngredientsTable = pgTable('ingredients', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  productId: uuid('product_id').references(() => ProductsTable.id).notNull(),
  name: text('ingredient_name').notNull(),
  quantityGross: numeric('quantity_gross').notNull(), 
  quantityNet: numeric('quantity_net').notNull(),    
  unit: text().default('гр'),                         
});


Шаги для ТехКарт 

export const RecipeStepsTable = pgTable('recipe_steps', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  stepNumber: integer('step_number').notNull(),
  description: text('description').notNull(),
  createdAt,
  updatedAt,
});

Задачи

export const TasksTable = pgTable('tasks', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  date: date('date').notNull(), // на какую дату запланировано
  portionsPlanned: numeric('portions_planned').notNull(), // сколько порций надо сделать
  status: text('status').default('pending'), // pending, in_progress, done
  createdAt,
  updatedAt
});

Изготовлено

export const ProducedTable = pgTable('produced', {
  id,
  recipeId: uuid('recipe_id').references(() => RecipesTable.id).notNull(),
  taskId: uuid('task_id').references(() => TasksTable.id), // можно сделать и без задачи
  date: date('date').notNull(),
  portions: numeric().notNull(), // сколько порций изготовлено
  createdAt,
});

Продажи

*Еще не реализоовано*

Вот Server actions

Продукты

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


ТехКарты 

'use server';

import { db } from '@/drizzle/db';
import { ProductsTable, RecipesTable, IngredientsTable } from '@/drizzle/schema';
import { eq, ilike } from 'drizzle-orm';

export async function createRecipe(formData) {
  try {
    const inserted = await db
      .insert(RecipesTable)
      .values({
        name: formData.name,
        type: formData.type, // добавлено
        portionSize: formData.portionSize,
        howTo: formData.howTo || '',
      })
      .returning({ id: RecipesTable.id });

    const recipeId = inserted[0].id;

    const ingredientValues = formData.ingredients.map((ingredient) => ({
      recipeId,
      productId: ingredient.productId,
      quantityGross: ingredient.quantityGross,
      quantityNet: ingredient.quantityNet,
      unit: ingredient.unit || 'гр',
    }));

    await db.insert(IngredientsTable).values(ingredientValues);

    return { success: true };
  } catch (error) {
    console.error('Ошибка при создании техкарты:', error);
    return { success: false, error: error.message };
  }
}


export async function getAllRecipes() {
  try {
    const recipes = await db.select().from(RecipesTable).orderBy(RecipesTable.name);
    return recipes;
  } catch (error) {
    console.error('Ошибка при получении рецептов:', error);
    return [];
  }
}

export async function getRecipesByType(type) {
  try {
    return await db.select().from(RecipesTable).where(eq(RecipesTable.type, type));
  } catch (error) {
    console.error('Ошибка при получении рецептов:', error);
    return [];
  }
}


export async function getRecipeIngredients(recipeId) {
  try {
    const ingredients = await db
      .select({
        id: IngredientsTable.id,
        productId: IngredientsTable.productId,
        productName: ProductsTable.name, // Получаем название продукта
        quantityGross: IngredientsTable.quantityGross,
        quantityNet: IngredientsTable.quantityNet,
        unit: IngredientsTable.unit
      })
      .from(IngredientsTable)
      .leftJoin(
        ProductsTable,
        eq(IngredientsTable.productId, ProductsTable.id)
      )
      .where(eq(IngredientsTable.recipeId, recipeId))

    return ingredients.map(ingredient => ({
      ...ingredient,
      quantityGross: ingredient.quantityGross.toString(),
      quantityNet: ingredient.quantityNet.toString()
    }))
  } catch (error) {
    console.error('Ошибка при получении ингредиентов:', error)
    return []
  }
}


Задачи

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


Продукция/ изготовленно

*еще не реализовано*