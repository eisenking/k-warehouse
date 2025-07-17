'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSale } from '@/actions/sales'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  productId: z.string().min(1, 'Выберите товар'),
  quantity: z.coerce.number().min(1, 'Минимум 1'),
})

export function SalesForm({ products }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    await createSale(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="productId">Товар</Label>
        <select {...register('productId')} className="w-full border p-2 rounded">
          <option value="">Выберите...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && <p className="text-red-500">{errors.productId.message}</p>}
      </div>

      <div>
        <Label htmlFor="quantity">Количество</Label>
        <Input type="number" {...register('quantity')} />
        {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
      </div>

      <Button type="submit">Сохранить</Button>
    </form>
  )
}
