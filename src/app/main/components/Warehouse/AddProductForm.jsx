'use client'

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { addProduct, getProductSuggestions } from '@/actions/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // ⬅️ добавили

const types = ['Овощи', 'Мясо', 'Рыба', 'Бакалея', 'Масло', 'Прочее']
const units = ['кг', 'л']

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  type: z.string().min(1, 'Тип обязателен'),
  quantity: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Должно быть числом',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Число должно быть больше 0',
    }),
  unit: z.string().min(1, 'Единица измерения обязательна'),
})

export default function AddProductForm() {
  const router = useRouter() // ⬅️ для router.refresh
  const [dialogOpen, setDialogOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [existingProduct, setExistingProduct] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      type: '',
      quantity: '',
      unit: 'кг',
    },
  })

  const watchType = watch('type')
  const watchUnit = watch('unit')

  const handleNameChange = async (e) => {
    const value = e.target.value
    setValue('name', value, { shouldValidate: true })

    if (value.length > 1) {
      try {
        const results = await getProductSuggestions(value)
        setSuggestions(results)
        const match = results.find(item => item.name.toLowerCase() === value.toLowerCase())
        if (match) {
          setValue('type', match.type)
          setValue('unit', match.unit || 'кг')
          setExistingProduct(true)
        } else {
          setExistingProduct(false)
        }
      } catch {
        toast.error('Ошибка при получении подсказок')
      }
    } else {
      setSuggestions([])
      setExistingProduct(false)
    }
  }

  const handleSelect = (suggestion) => {
    setValue('name', suggestion.name, { shouldValidate: true })
    setValue('type', suggestion.type, { shouldValidate: true })
    setValue('unit', suggestion.unit || 'кг', { shouldValidate: true })
    setSuggestions([])
    setExistingProduct(true)
  }

  const onSubmit = async (data) => {
    try {
      await addProduct(data)
      toast.success(`Товар "${data.name}" добавлен`)
      reset()
      setExistingProduct(false)
      setDialogOpen(false) // ⬅️ Закрытие модалки
      router.refresh()     // ⬅️ Обновление таблицы
    } catch (err) {
      toast.error('Ошибка при добавлении товара')
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить продукт</DialogTitle>
          <DialogDescription>Укажите данные нового продукта</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Название */}
          <div className="flex flex-col gap-1 relative">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите название"
              {...register('name')}
              onChange={handleNameChange}
              autoComplete="off"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow mt-16 max-h-60 overflow-auto">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item.name} <span className="text-gray-500">({item.type})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Тип */}
          <div className="flex flex-col gap-1">
            <Label>Тип</Label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  type="button"
                  key={type}
                  onClick={() => setValue('type', type, { shouldValidate: true })}
                  disabled={existingProduct}
                  variant={watchType === type ? 'default' : 'outline'}
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {/* Количество */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Введите количество"
              {...register('quantity')}
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
          </div>

          {/* Единицы */}
          <div className="flex flex-col gap-1">
            <Label>Единица</Label>
            <div className="flex gap-2">
              {units.map((unit) => (
                <Button
                  type="button"
                  key={unit}
                  onClick={() => setValue('unit', unit, { shouldValidate: true })}
                  disabled={existingProduct}
                  variant={watchUnit === unit ? 'default' : 'outline'}
                >
                  {unit}
                </Button>
              ))}
            </div>
            {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Добавление...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}