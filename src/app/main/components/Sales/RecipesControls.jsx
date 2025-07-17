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
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getProducts } from '@/actions/products';
import { createRecipe } from '@/actions/recipes';

export default function RecipesControls( { onCreated }) {
  const router = useRouter()
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const ingredientTypes = [
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      portionSize: '',
      howTo: '',
      type: '',
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const watchedIngredients = useWatch({ control, name: 'ingredients' });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // const onSubmit = async (data) => {
  //   try {
  //     await createRecipe(data);
  //     toast.success('Техкарта создана!');
  //     reset();
  //     setOpen(false)
  //     router.refresh()
  //   } catch (err) {
  //     console.log(err)
  //     toast.error('Ошибка при создании техкарты');
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      await createRecipe(data);
      toast.success('Техкарта создана!');
      reset();
      setOpen(false);

      if (onCreated) onCreated(); // 🔁 ВАЖНО: Обновляем список

    } catch (err) {
      console.log(err);
      toast.error('Ошибка при создании техкарты');
    }
  };


  const totalCost = watchedIngredients?.reduce((acc, ing) => {
    const product = products.find((p) => p.id === ing.productId);
    if (!product || !ing.quantityNet) return acc;
    return acc + ((ing.quantityNet / 1000) * product.price || 0);
  }, 0) || 0;

  const totalNetWeight = watchedIngredients?.reduce((acc, ing) => {
    return acc + Number(ing.quantityNet || 0);
  }, 0) || 0;

  return (
    <div className="flex justify-center items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Добавить ТехКарту
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            <div className="flex flex-col gap-2">
              <Label>Ингредиенты</Label>
              {fields.map((field, index) => {
                const selectedType = watch(`ingredients.${index}.type`);
                const filteredProducts = products.filter((p) => p.type === selectedType);
                const selectedProduct = products.find(
                  (p) => p.id === watch(`ingredients.${index}.productId`)
                );
                const quantityNet = watch(`ingredients.${index}.quantityNet`);
                const cost =
                  selectedProduct && quantityNet
                    ? ((quantityNet / 1000) * selectedProduct.price).toFixed(2)
                    : '-';

                return (
                 <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
                  {/* Верхняя строка: тип + продукт */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Тип ингредиента */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.type`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Тип" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredientTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {/* Продукт */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.productId`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Продукт" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Нижняя строка: брутто, нетто, стоимость, удалить */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Брутто (г)"
                      {...register(`ingredients.${index}.quantityGross`, { required: true })}
                    />
                    <Input
                      type="number"
                      placeholder="Нетто (г)"
                      {...register(`ingredients.${index}.quantityNet`, { required: true })}
                    />
                    <div className="text-sm text-muted-foreground">
                      {cost !== '-' ? `${cost} ₽` : '–'}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="justify-self-start"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>


                );
              })}

              <Button
                type="button"
                onClick={() =>
                  append({
                    type: '',
                    productId: '',
                    quantityGross: '',
                    quantityNet: '',
                  })
                }
                variant="outline"
                className="mt-2"
              >
                + Добавить ингредиент
              </Button>

              {/* Итог */}
              <div className="text-sm mt-4 text-right border-t pt-2">
                <p>Итоговая масса: <strong>{totalNetWeight} г</strong></p>
                <p>Итоговая стоимость: <strong>{totalCost.toFixed(2)} ₽</strong></p>
              </div>
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