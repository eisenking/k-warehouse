'use server';

import { db } from '@/drizzle/db';
import { ProductsTable, RecipesTable, IngredientsTable, RecipeStepsTable } from '@/drizzle/schema';
import { eq, inArray} from 'drizzle-orm';

// export async function createRecipe(formData) {
//   try {
//     const inserted = await db
//       .insert(RecipesTable)
//       .values({
//         name: formData.name,
//         type: formData.type, // добавлено
//         portionSize: formData.portionSize,
//         howTo: formData.howTo || '',
//       })
//       .returning({ id: RecipesTable.id });

//     const recipeId = inserted[0].id;

//     const ingredientValues = formData.ingredients.map((ingredient) => ({
//       recipeId,
//       productId: ingredient.productId,
//       name: ingredient.name,
//       quantityGross: ingredient.quantityGross,
//       quantityNet: ingredient.quantityNet,
//       unit: ingredient.unit || 'гр',
//     }));

//     await db.insert(IngredientsTable).values(ingredientValues);

//     return { success: true };
//   } catch (error) {
//     console.error('Ошибка при создании техкарты:', error);
//     return { success: false, error: error.message };
//   }
// }

export async function createRecipe(formData) {
  try {
    // 1. Создаем рецепт
    const inserted = await db
      .insert(RecipesTable)
      .values({
        name: formData.name,
        type: formData.type,
        portionSize: formData.portionSize,
        howTo: formData.howTo || '',
      })
      .returning({ id: RecipesTable.id });

    const recipeId = inserted[0].id;

    // 2. Получаем все продукты, которые используются в ингредиентах
    const productIds = formData.ingredients.map(ing => ing.productId);
    const products = await db
      .select()
      .from(ProductsTable)
      .where(inArray(ProductsTable.id, productIds));

    // 3. Создаем объект для быстрого поиска продукта по ID
    const productMap = Object.fromEntries(
      products.map(p => [p.id, p])
    );

    // 4. Подготавливаем ингредиенты с автоматическим добавлением имени
    const ingredientValues = formData.ingredients.map(ing => ({
      recipeId,
      productId: ing.productId,
      name: productMap[ing.productId]?.name || "Неизвестный продукт", // <- берём имя из базы
      quantityGross: ing.quantityGross,
      quantityNet: ing.quantityNet,
      unit: 'гр', // или можно передать из формы, если нужно
    }));

    // 5. Сохраняем ингредиенты
    await db.insert(IngredientsTable).values(ingredientValues);

    // 6. Сохраняем шаги (если есть)
    if (formData.steps?.length) {
      const stepValues = formData.steps.map((step, index) => ({
        recipeId,
        stepNumber: index + 1,
        description: step.text,
      }));
      await db.insert(RecipeStepsTable).values(stepValues);
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка при создании техкарты:', error);
    return { success: false, error: error.message };
  }
}



// export async function createRecipe(formData) {
//   try {
//     const inserted = await db
//       .insert(RecipesTable)
//       .values({
//         name: formData.name,
//         type: formData.type,
//         portionSize: formData.portionSize,
//         howTo: formData.howTo || '',
//       })
//       .returning({ id: RecipesTable.id });

//     const recipeId = inserted[0].id;

//     // Сохраняем ингредиенты
//     console.log(formData)
//     const ingredientValues = formData.ingredients.map((ingredient) => ({
//       recipeId,
//       productId: ingredient.productId,
//       name: ingredient.name,
//       quantityGross: ingredient.quantityGross,
//       quantityNet: ingredient.quantityNet,
//       unit: ingredient.unit || 'гр',
//     }));

//     await db.insert(IngredientsTable).values(ingredientValues);

//     // Сохраняем шаги рецепта
//     if (formData.steps && formData.steps.length > 0) {
//       const stepValues = formData.steps.map((step, index) => ({
//         recipeId,
//         stepNumber: index + 1,
//         description: step.text,
//       }));

//       await db.insert(RecipeStepsTable).values(stepValues);
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Ошибка при создании техкарты:', error);
//     return { success: false, error: error.message };
//   }
// }

// Добавим функцию для получения шагов рецепта
export async function getRecipeSteps(recipeId) {
  try {
    const steps = await db
      .select()
      .from(RecipeStepsTable)
      .where(eq(RecipeStepsTable.recipeId, recipeId))
      .orderBy(RecipeStepsTable.stepNumber);

    return steps;
  } catch (error) {
    console.error('Ошибка при получении шагов рецепта:', error);
    return [];
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