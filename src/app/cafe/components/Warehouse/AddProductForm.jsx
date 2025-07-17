'use client'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { authClient } from "@/lib/auth-client";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { addProduct, getProductSuggestions } from '@/actions/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PlusIcon, ChevronDown, ChevronUp } from 'lucide-react'

const types = [
  'Мясо, субпродукты',
  'Рыба, морепродукты',
  'Птица, яйца',
  'Овощи, зелень',
  'Фрукты, ягоды',
  'Молочные продукты',
  'Крупы, мука, хлеб',
  'Макароны, изделия из теста',
  'Специи, приправы',
  'Сахар, сладости',
  'Жиры, масла',
  'Прочее',
]

const units = ['кг', 'г', 'л', 'мл', 'шт']
const itemUnits = ['г', 'кг', 'мл', 'л']

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  type: z.string().min(1, 'Тип обязателен'),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Количество должно быть положительным числом',
  }),
  priceTotal: z.string().optional(),
  pricePerUnit: z.string().optional(),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  itemAmount: z.string().optional(), 
  itemUnit: z.string().optional(), 
  totalAmount: z.string().optional(),
})

export default function AddProductForm() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [existingProduct, setExistingProduct] = useState(false)
  const [showTypes, setShowTypes] = useState(false)
  const [itemUnit, setItemUnit] = useState('г')

  const { 
    data: session, 
    isPending, 
    error, 
    refetch
  } = authClient.useSession() 

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
      priceTotal: '',
      pricePerUnit: '',
      unit: 'кг',
      itemAmount: '',
      itemUnit: 'г',
      totalAmount: '',
      userId: ''
    },
  })

  const watchType = watch('type')
  const watchUnit = watch('unit')
  const watchQuantity = watch('quantity')
  const watchPriceTotal = watch('priceTotal')
  const watchPricePerUnit = watch('pricePerUnit')
  const watchItemAmount = watch('itemAmount')
  const watchTotalAmount = watch('totalAmount')

  const [activeField, setActiveField] = useState(null)

  // Расчеты цен
  useEffect(() => {
    const qty = parseFloat(watchQuantity)
    const total = parseFloat(watchPriceTotal)
    if (activeField === 'total' && !isNaN(qty) && qty > 0 && !isNaN(total)) {
      const perUnit = (total / qty).toFixed(2)
      setValue('pricePerUnit', perUnit)
    }
  }, [watchQuantity, watchPriceTotal])

  useEffect(() => {
    const qty = parseFloat(watchQuantity)
    const perUnit = parseFloat(watchPricePerUnit)
    if (activeField === 'unit' && !isNaN(qty) && qty > 0 && !isNaN(perUnit)) {
      const total = (qty * perUnit).toFixed(2)
      setValue('priceTotal', total)
    }
  }, [watchQuantity, watchPricePerUnit])

  // Расчет общего веса/объема для штучных товаров
  useEffect(() => {
    if (watchUnit === 'шт') {
      const qty = parseFloat(watchQuantity)
      const amount = parseFloat(watchItemAmount)
      
      if (!isNaN(qty) && qty > 0 && !isNaN(amount) && amount > 0) {
        let total
        if (itemUnit === 'г') {
          total = (qty * amount / 1000).toFixed(1) // переводим в кг
        } else if (itemUnit === 'мл') {
          total = (qty * amount / 1000).toFixed(1) // переводим в л
        } else {
          total = (qty * amount).toFixed(1) // кг или л
        }
        setValue('totalAmount', total)
      }
    }
  }, [watchQuantity, watchItemAmount, watchUnit, itemUnit])

  const handleNameChange = async (e) => {
    const value = e.target.value
    setValue('name', value, { shouldValidate: true })

    if (value.length > 1) {
      try {
        const results = await getProductSuggestions(value)
        setSuggestions(results)
        const match = results.find((item) => item.name.toLowerCase() === value.toLowerCase())
        if (match) {
          setValue('type', match.type)
          setValue('unit', match.unit || 'кг')
          if (match.unit === 'шт' && match.itemAmount) {
            // Определяем подходящую единицу измерения
            if (match.itemAmount < 1) {
              setValue('itemAmount', (match.itemAmount * 1000).toString())
              setItemUnit(match.itemUnit === 'кг' ? 'г' : 'мл')
            } else {
              setValue('itemAmount', match.itemAmount.toString())
              setItemUnit(match.itemUnit)
            }
          }
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

  const handleTypeSelect = (type) => {
    setValue('type', type, { shouldValidate: true })
    setShowTypes(false)
  }

  const handleSelect = (suggestion) => {
    setValue('name', suggestion.name, { shouldValidate: true })
    setValue('type', suggestion.type, { shouldValidate: true })
    setValue('unit', suggestion.unit || 'кг', { shouldValidate: true })
    if (suggestion.unit === 'шт' && suggestion.itemAmount) {
      setValue('itemAmount', suggestion.itemAmount.toString())
      setItemUnit(suggestion.itemUnit)
    }
    setSuggestions([])
    setExistingProduct(true)
  }

  const onSubmit = async (data) => {
    const price = parseFloat(data.priceTotal || '0')
    if (!price || price <= 0) {
      toast.error('Введите корректную цену')
      return
    }

    try {
      // Конвертируем в базовые единицы (кг или л) перед сохранением
      let itemAmount = parseFloat(data.itemAmount || '0')
      let totalAmount = parseFloat(data.totalAmount || '0')
      
      if (data.unit === 'шт' && itemAmount > 0) {
        if (itemUnit === 'г') itemAmount = itemAmount / 1000
        if (itemUnit === 'мл') itemAmount = itemAmount / 1000
      }

      await addProduct({
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        unit: data.unit,
        price: String(price),
        itemAmount: data.unit === 'шт' ? itemAmount.toString() : null,
        itemUnit: data.unit === 'шт' ? itemUnit : null,
        totalAmount: data.unit === 'шт' 
          ? totalAmount.toString()
          : data.quantity,
        userId: session.user.id,
      })

      toast.success(`Товар "${data.name}" добавлен ${session.user.name}`)
      reset()
      setExistingProduct(false)
      setDialogOpen(false)
      router.refresh()
    } catch (err) {
      toast.error('Ошибка при добавлении товара')
      console.error(err)
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
      <DialogContent className="max-w-md">
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

          <div className="flex flex-col gap-1">
            <Label>Тип</Label>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-between"
                onClick={() => setShowTypes(!showTypes)}
                disabled={existingProduct}
              >
                {watchType || "Выберите тип"}
                {showTypes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              {showTypes && (
                <div className="flex flex-wrap gap-1 text-sm">
                  {types.map((type) => (
                    <Button
                      type="button"
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      disabled={existingProduct}
                      variant={watchType === type ? 'default' : 'outline'}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {/* Единицы измерения товара */}
          <div className="flex flex-col gap-1 text-sm">
            <Label>Единица измерения товара</Label>
            <div className="flex gap-1 flex-wrap">
              {units.map((unit) => (
                <Button
                  type="button"
                  key={unit}
                  onClick={() => {
                    setValue('unit', unit, { shouldValidate: true })
                    // Сбрасываем дополнительные поля при смене единиц измерения
                    if (unit !== 'шт') {
                      setValue('itemAmount', '')
                      setValue('totalAmount', '')
                    }
                  }}
                  disabled={existingProduct}
                  variant={watchUnit === unit ? 'default' : 'outline'}
                >
                  {unit}
                </Button>
              ))}
            </div>
            {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
          </div>

          {/* Количество */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="quantity">Количество {watchUnit}.</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              placeholder="Введите количество"
              {...register('quantity')}
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
          </div>

          {/* Вес/Объем 1 шт. (только для штучных товаров) */}
          {watchUnit === "шт" && (
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor="itemAmount">Вес/Объем 1 шт.</Label>
                  <div className="flex gap-2">
                    <Input
                      id="itemAmount"
                      type="number"
                      step="0.001"
                      placeholder="Введите вес"
                      {...register('itemAmount')}
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="itemUnit">Ед.</Label>
                  <select 
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="border rounded h-9 p-1"
                  >
                    {itemUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <Label>Общий вес/объем</Label>
                  <div className="flex items-center gap-2 h-9 px-2 py-2 border rounded bg-muted">
                    {watchTotalAmount}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Цена */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="pricePerUnit">Цена за 1 {watchUnit}.</Label>
              <Input
                id="pricePerUnit"
                type="number"
                step="any"
                placeholder="Введите цену"
                {...register('pricePerUnit')}
                onFocus={() => setActiveField('unit')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="priceTotal">Цена за партию</Label>
              <Input
                id="priceTotal"
                type="number"
                step="any"
                placeholder="Введите цену"
                {...register('priceTotal')}
                onFocus={() => setActiveField('total')}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Добавление...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}