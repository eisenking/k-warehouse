'use client';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
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
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/actions/products';
import { createRecipe } from '@/actions/recipes';
import { RecipeSteps } from './RecipeSteps';
import { RecipeIngredients } from './RecipeIngredients';

export default function RecipesControls({ onCreated }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [stepStates, setStepStates] = useState({});
  const [addedIngredients, setAddedIngredients] = useState({});
  
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
  ];

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const nonEmptyIngredientTypes = useMemo(() => {
    return ingredientTypes.filter(type => {
      const productsOfType = products.filter(p => p.type === type);
      return productsOfType.length > 0;
    });
  }, [products, ingredientTypes]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      portionSize: 0,
      steps: [],
      type: '',
      ingredients: [],
    },
  });

  const productsByType = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.type]) {
        acc[product.type] = [];
      }
      acc[product.type].push(product);
      return acc;
    }, {});
  }, [products]);

  const [totalCost, totalNetWeight] = useMemo(() => {
    const ingredients = watch('ingredients') || [];
    const productsMap = products.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const netWeight = ingredients.reduce((acc, ing) => {
      if (ing.unit === 'шт') {
        return acc + (Number(ing.quantity) * Number(ing.unitWeight || 0));
      }
      return acc + Number(ing.quantityNet || 0);
    }, 0);

    const cost = ingredients.reduce((acc, ing) => {
      const product = productsMap[ing.productId];
      if (!product) return acc;
      
      if (ing.unit === 'шт') {
        return acc + (Number(ing.quantity) * product.price || 0);
      }
      return acc + ((ing.quantityNet / 1000) * product.price || 0);
    }, 0);

    return [cost, netWeight];
  }, [watch('ingredients'), products]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        steps: data.steps.map((step, index) => ({
          text: step.text,
          stepNumber: index + 1,
        })),
      };
      await createRecipe(formData);
      toast.success('Техкарта создана!');
      reset();
      setOpen(false);
      setStepStates({});
      setAddedIngredients({});

      if (onCreated) onCreated();
    } catch (err) {
      console.log(err);
      toast.error('Ошибка при создании техкарты');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            reset();
            setStepStates({});
            setAddedIngredients({});
          }
        }}
      >
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

            <div className='flex flex-wrap gap-2'>
              <div className="grid gap-2">
                <Label htmlFor="type">Тип блюда</Label>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
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
                <Label htmlFor="portionSize">Размер порции, грамм</Label>
                <Input
                  id="portionSize"
                  type="number"
                  {...register('portionSize', { required: true, valueAsNumber: true })}
                />
              </div>
            </div>

            <RecipeSteps 
              control={control} 
              register={register} 
              watch={watch} 
              setStepStates={setStepStates} 
              stepStates={stepStates} 
            />

            <RecipeIngredients
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              products={products}
              productsByType={productsByType}
              nonEmptyIngredientTypes={nonEmptyIngredientTypes}
              addedIngredients={addedIngredients}
              setAddedIngredients={setAddedIngredients}
              // totalCost={totalCost}
              // totalNetWeight={totalNetWeight}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}