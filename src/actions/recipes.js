'use server';

import { db } from '@/drizzle/db';
import { RecipesTable, IngredientsTable } from '@/drizzle/schema';
import { eq, ilike } from 'drizzle-orm';


// export async function createRecipe(formData) {
//   try {
//     // 1. Вставляем рецепт и получаем его id
//     const inserted = await db
//       .insert(RecipesTable)
//       .values({
//         name: formData.name,
//         portionSize: formData.portionSize,
//         howTo: formData.howTo || '',
//       })
//       .returning({ id: RecipesTable.id });

//     const recipeId = inserted[0].id;

//     // 2. Вставляем ингредиенты без ручного генерации id
//     const ingredientValues = formData.ingredients.map((ingredient) => ({
//       recipeId,
//       productId: ingredient.productId,
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