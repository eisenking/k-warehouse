// "use client"

// import { useState } from "react"
// import { format } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import { CalendarIcon } from "lucide-react"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { createTask, getRecipes } from "@/actions/tasks"


// const formSchema = z.object({
//   recipeId: z.string().uuid(),
//   date: z.date(),
//   portionsPlanned: z.coerce.number().positive(),
// })

// interface AddTaskFormProps {
//   onSuccess: () => void
// }

// export function AddTaskForm({ onSuccess }: AddTaskFormProps) {
//   const [recipes, setRecipes] = useState([])
//   const [loading, setLoading] = useState(true)

//   useState(() => {
//     const fetchRecipes = async () => {
//       try {
//         const recipesData = await getRecipes()
//         setRecipes(recipesData)
//       } catch (error) {
//         console.error("Failed to fetch recipes:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRecipes()
//   }, [])

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: new Date(),
//       portionsPlanned: 1,
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       await createTask(values)
//       form.reset()
//       onSuccess()
//     } catch (error) {
//       console.error("Failed to create task:", error)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="recipeId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Recipe</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a recipe" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {recipes.map((recipe) => (
//                     <SelectItem key={recipe.id} value={recipe.id}>
//                       {recipe.name} ({recipe.type})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="date"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Date</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant={"outline"}
//                       className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                     >
//                       {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                 </PopoverContent>
//               </Popover>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="portionsPlanned"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Portions</FormLabel>
//               <FormControl>
//                 <Input type="number" min="1" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" className="w-full">
//           Add Task
//         </Button>
//       </form>
//     </Form>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createTask, getRecipes } from "@/actions/tasks"


const formSchema = z.object({
  recipeId: z.string().uuid(),
  date: z.date(),
  portionsPlanned: z.coerce.number().positive(),
})

interface AddTaskFormProps {
  onSuccess: () => void
}

export function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  // Fix: Use useEffect instead of useState for side effects
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesData = await getRecipes()
        setRecipes(recipesData)
      } catch (error) {
        console.error("Failed to fetch recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      portionsPlanned: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTask(values)
      console.log("Submitting with date:", values.date, "Type:", typeof values.date);
      form.reset()
      onSuccess()

    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading recipes..." : "Select a recipe"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} ({recipe.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portionsPlanned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portions</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          Add Task
        </Button>
      </form>
    </Form>
  )
}
