// 'use client';
// import { useEffect, useState } from 'react';
// import { getRecipesByType } from '@/actions/recipes';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import { Card, CardContent } from '@/components/ui/card';

// export default function RecipesCarousel({ type }) {
//   const [recipes, setRecipes] = useState([]);

//   useEffect(() => {
//     getRecipesByType(type).then(setRecipes);
//   }, [type]);

//   return (
//     <Carousel opts={{ loop: true }} className="m-auto w-full max-w-md">
//       <CarouselContent className="-ml-1">
//         {recipes.map((recipe) => (
//           <CarouselItem key={recipe.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
//             <div className="p-1">
//               <Card>
//                 <CardContent className="flex aspect-square items-center justify-center p-6">
//                   <span className="text-xl font-semibold text-center">{recipe.name}</span>
//                 </CardContent>
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   );
// }


// 'use client';
// import { useEffect, useState } from 'react';
// import { getRecipesByType } from '@/actions/recipes';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import { Card, CardContent } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton'; // подключаем Skeleton от shadcn

// export default function RecipesCarousel({ type }) {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     getRecipesByType(type)
//       .then((data) => setRecipes(data))
//       .finally(() => setLoading(false));
//   }, [type]);

//   return (
//     <Carousel opts={{ loop: true }} className="m-auto w-full max-w-6xl">
//       <CarouselContent className="-ml-1">
//         {loading
//           ? Array.from({ length: 6 }).map((_, i) => (
//               <CarouselItem key={i} className="pl-1  basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
//                 <div className="p-1">
//                   <Card>
//                     <CardContent className="flex aspect-square items-center justify-center p-6">
//                       <Skeleton className="h-6 w-32" />
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CarouselItem>
//             ))
//           : recipes.map((recipe) => (
//               <CarouselItem key={recipe.id} className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
//                 <div className="p-1">
//                   <Card>
//                     <CardContent className="flex aspect-square items-center justify-center p-6">
//                       <span className="text-xl font-semibold text-center">{recipe.name}</span>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CarouselItem>
//             ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   );
// }

"use client"
import { useEffect, useState } from "react"
import { getRecipesByType } from "@/actions/recipes"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecipesCarousel({ type }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getRecipesByType(type)
      .then((data) => setRecipes(data))
      .finally(() => setLoading(false))
  }, [type])

  return (
    <div className="px-12">
      <Carousel opts={{ loop: true }} className="m-auto w-full px-6">
        <CarouselContent className="-ml-1">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Skeleton className="h-6 w-32" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            : recipes.map((recipe) => (
                <CarouselItem
                  key={recipe.id}
                  className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                >
                  <div className="p-1">
                    <Card>
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
    </div>
  )
}
