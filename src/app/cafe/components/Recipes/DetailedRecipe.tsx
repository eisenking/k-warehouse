"use client"
import { useState, useEffect } from "react"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getRecipeIngredients } from "@/actions/recipes"

interface Recipe {
  id: string
  name: string
  type: string
  portionSize: string
  howTo: string
}

interface IngredientWithProduct {
  id: string
  productId: string
  productName: string
  quantityGross: string
  quantityNet: string
  unit: string
}

interface DetailedRecipeProps {
  recipe: Recipe | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (data: {
    date: Date
    portions: number
    description: string
  }) => Promise<void>
}

export function DetailedRecipe({
  recipe,
  open,
  onOpenChange,
  onCreateTask,
}: DetailedRecipeProps) {
  const [ingredients, setIngredients] = useState<IngredientWithProduct[]>([])
  const [loadingIngredients, setLoadingIngredients] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      date: new Date(),
      portions: 1,
      description: ''
    }
  })

  const selectedDate = watch('date')

  useEffect(() => {
    if (open && recipe) {
      setLoadingIngredients(true)
      getRecipeIngredients(recipe.id)
        .then(setIngredients)
        .finally(() => setLoadingIngredients(false))
      reset({
        date: new Date(),
        portions: 1,
        description: ''
      })
      setShowTaskForm(false)
    }
  }, [open, recipe, reset])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowTaskForm(false)
      reset()
    }
    onOpenChange(open)
  }

  const onSubmit = async (data: {
    date: Date
    portions: number
    description: string
  }) => {
    setIsCreatingTask(true)
    try {
      await onCreateTask(data)
      toast.success("Задача успешно создана")
      setShowTaskForm(false)
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast.error("Ошибка при создании задачи")
    } finally {
      setIsCreatingTask(false)
    }
  }

  if (!recipe) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
          <DialogDescription>Технологическая карта</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Тип</h4>
              <p>{recipe.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Размер порции</h4>
              <p>{recipe.portionSize}</p>
            </div>
          </div>
          
          {recipe.howTo && (
            <div>
              <h4 className="font-medium mb-2">Способ приготовления:</h4>
              <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">
                {recipe.howTo}
              </p>
            </div>
          )}
          
          {loadingIngredients ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : ingredients.length > 0 ? (
            <div className="">
              <h4 className="font-medium mb-2">Ингредиенты:</h4>
              <div className="space-y-3">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex justify-between text-sm p-3 bg-muted/50 rounded-md">
                    <span className="font-medium">{ingredient.productName}</span>
                    <span>
                      {ingredient.quantityNet} {ingredient.unit} (брутто: {ingredient.quantityGross} {ingredient.unit})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Нет данных об ингредиентах
            </div>
          )}
          
          {!showTaskForm ? (
            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowTaskForm(true)}>
                Создать задачу
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Новая задача</h4>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div>
                    <Label htmlFor="date">Дата выполнения</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Выберите дату</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setValue('date', date || new Date())}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="portions">Количество порций</Label>
                    <Input 
                      id="portions" 
                      type="number" 
                      min="1" 
                      step="1"
                      required
                      {...register('portions', { required: true, min: 1 })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Описание (необязательно)</Label>
                  <Textarea 
                    className="overflow-x-hidden break-all resize-y whitespace-pre-wrap"
                    id="description"
                    placeholder="Дополнительные указания..."
                    {...register('description')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTaskForm(false)}
                  disabled={isCreatingTask}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreatingTask}
                >
                  {isCreatingTask ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : "Создать задачу"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}