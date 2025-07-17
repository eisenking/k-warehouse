"use client"

import { useEffect, useState } from "react"
import { getRecipesByType } from "@/actions/recipes"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailedRecipe } from "./DetailedRecipe"
import { createTask } from "@/actions/tasks"
import AddRecipeForm from "./AddRecipeForm/AddRecipeForm"
import RecipesControls from "./RecipesControls"

export default function RecipesCarousel({ type }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ingredients, setIngredients] = useState([])

  const fetchRecipes = async () => {
    setLoading(true);
    const data = await getRecipesByType(type);
    setRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, [type]);


  // useEffect(() => {
  //   setLoading(true)
  //   getRecipesByType(type)
  //     .then((data) => setRecipes(data))
  //     .finally(() => setLoading(false))
  // }, [type])

  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe)
    // Здесь можно добавить загрузку ингредиентов
    setIsDialogOpen(true)
  }

  const handleCreateTask = async (taskData) => {
    if (!selectedRecipe) return
    return createTask({
      recipeId: selectedRecipe.id,
      date: taskData.date,
      portionsPlanned: taskData.portions,
      description: taskData.description
    })
  }

  return (
    <div className="flex flex-col px-12 gap-2">
    {/* <RecipesControls onCreated={fetchRecipes} /> */}
    <AddRecipeForm onCreated={fetchRecipes} />
    {loading ? (
      <Carousel opts={{ loop: true }} className="m-auto w-full px-6">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <CarouselItem key={i} className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Skeleton className="h-6 w-32" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    ) : recipes.length === 0 ? (
      <p className="text-center text-muted-foreground text-lg py-8">Техкарт нет</p>
    ) : (
      <Carousel opts={{ loop: true }} className="m-auto w-full px-6">
        <CarouselContent className="-ml-1">
          {recipes.map((recipe) => (
            <CarouselItem
              key={recipe.id}
              className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
            >
              <div className="p-1">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-xl font-semibold text-center">{recipe.name}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )}

    <DetailedRecipe
      recipe={selectedRecipe}
      ingredients={ingredients}
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onCreateTask={handleCreateTask}
    />
  </div>
  )
}