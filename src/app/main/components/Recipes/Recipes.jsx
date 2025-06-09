


import RecipesControls from "./RecipesControls";
import RecipesList from "./RecipesList";

export default async function Recipes() {
  // const tasks = await getTasks();


  return (
    <>
        <RecipesList />
        <RecipesControls />
    </>
  )
}