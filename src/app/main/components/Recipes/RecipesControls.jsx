// "use client";
// import {
//   Dialog,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogContent,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { PlusIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from 'sonner';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// export default  function RecipesControls() {
//   return (
//     <div>
//         <div className="flex items-center mb-4">
//         <Dialog>
//             <DialogTrigger asChild>
//             <Button>
//                 <PlusIcon className="w-4 h-4 mr-2" />
//                 Добавить ТехКарту
//             </Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Добавить продукт</DialogTitle>
//                     <DialogDescription>Укажите данные нового продукта</DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//                     <div className="grid gap-2">
//                         <Label htmlFor="name">Название</Label>
//                         <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="portionSize">Размер порции (гр)</Label>
//                         <Input id="portionSize" type="number" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} required />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="howTo">Инструкция (необязательно)</Label>
//                         <Input id="howTo" value={howTo} onChange={(e) => setHowTo(e.target.value)} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label>Ингредиенты</Label>
//                         {ingredients.map((ingredient, index) => (
//                         <div key={index} className="grid grid-cols-3 gap-2 items-center">
//                             <Select
//                             value={ingredient.productId}
//                             onValueChange={(value) => handleIngredientChange(index, 'productId', value)}
//                             >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Продукт" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {products.map((product) => (
//                                 <SelectItem key={product.id} value={product.id}>
//                                     {product.name}
//                                 </SelectItem>
//                                 ))}
//                             </SelectContent>
//                             </Select>

//                             <Input
//                             type="number"
//                             placeholder="Кол-во"
//                             value={ingredient.quantity}
//                             onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
//                             />

//                             <Input
//                             placeholder="Ед."
//                             value={ingredient.unit}
//                             onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
//                             />
//                         </div>
//                         ))}

//                         <Button type="button" onClick={handleAddIngredient} variant="outline" className="mt-2">
//                         + Добавить ингредиент
//                         </Button>
//                     </div>

//                     <Button type="submit">Создать</Button>

//                 </form>
        
//             </DialogContent>
//         </Dialog>
//         </div>
//     </div>
//   )
// }

'use client';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getProducts } from '@/actions/products';
import { createRecipe } from '@/actions/recipes';

export default function RecipesControls() {
  const [products, setProducts] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      portionSize: '',
      howTo: '',
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const onSubmit = async (data) => {
    try {
      await createRecipe(data);
      toast.success('Техкарта создана!');
      reset();
    } catch (err) {
      toast.error('Ошибка при создании техкарты');
    }
  };

  return (
    <div className="flex items-center mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Добавить ТехКарту
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить техкарту</DialogTitle>
            <DialogDescription>Укажите данные рецепта и ингредиенты</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...register('name', { required: true })} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="type">Тип блюда</Label>
                <Controller
                    control={control}
                    name="type"
                    rules={{ required: true }}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                        <SelectValue placeholder="Выберите тип блюда" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="first">Первые блюда</SelectItem>
                        <SelectItem value="second">Вторые</SelectItem>
                        <SelectItem value="desserts">Десерты</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="portionSize">Размер порции (гр)</Label>
              <Input
                id="portionSize"
                type="number"
                {...register('portionSize', { required: true })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="howTo">Инструкция (необязательно)</Label>
              <Input id="howTo" {...register('howTo')} />
            </div>

            <div className="grid gap-2">
              <Label>Ингредиенты</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-2 items-center">
                  <Controller
                    control={control}
                    name={`ingredients.${index}.productId`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Продукт" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Input
                    type="number"
                    placeholder="Брутто"
                    {...register(`ingredients.${index}.quantityGross`, { required: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Нетто"
                    {...register(`ingredients.${index}.quantityNet`, { required: true })}
                  />
                  <Button type="button" variant="ghost" onClick={() => remove(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ productId: '', quantityGross: '', quantityNet: '', unit: 'гр' })}
                variant="outline"
                className="mt-2"
              >
                + Добавить ингредиент
              </Button>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
