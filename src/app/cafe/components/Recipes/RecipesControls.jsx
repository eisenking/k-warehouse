// 'use client';
// import {
//   Dialog,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogContent,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, EditIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { toast } from 'sonner';
// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getProducts } from '@/actions/products';
// import { createRecipe } from '@/actions/recipes';
// import { Textarea } from '@/components/ui/textarea';

// export default function RecipesControls({ onCreated }) {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [stepStates, setStepStates] = useState({});
  
//   const ingredientTypes = [
//     'Мясо, субпродукты',
//     'Рыба, морепродукты',
//     'Птица, яйца',
//     'Овощи, зелень',
//     'Фрукты, ягоды',
//     'Молочные продукты',
//     'Крупы, мука, хлеб',
//     'Макароны, изделия из теста',
//     'Специи, приправы',
//     'Сахар, сладости',
//     'Жиры, масла',
//     'Прочее',
//   ];

//   useEffect(() => {
//     getProducts().then(setProducts);
//   }, []);

//   // Фильтрация типов ингредиентов, у которых есть продукты
//   const nonEmptyIngredientTypes = useMemo(() => {
//     return ingredientTypes.filter(type => {
//       const productsOfType = products.filter(p => p.type === type);
//       return productsOfType.length > 0;
//     });
//   }, [products, ingredientTypes]);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     formState: { isSubmitting },
//   } = useForm({
//     defaultValues: {
//       name: '',
//       portionSize: '',
//       steps: [],
//       type: '',
//       ingredients: [],
//     },
//   });

//   const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
//     control,
//     name: 'ingredients',
//   });

//   const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
//     control,
//     name: 'steps',
//   });

//   const productsByType = useMemo(() => {
//     return products.reduce((acc, product) => {
//       if (!acc[product.type]) {
//         acc[product.type] = [];
//       }
//       acc[product.type].push(product);
//       return acc;
//     }, {});
//   }, [products]);

//   const toggleStep = (index) => {
//     setStepStates(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         expanded: !prev[index]?.expanded
//       }
//     }));
//   };

//   const handleStepState = (index, state) => {
//     setStepStates(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         ...state
//       }
//     }));
//   };

//   const onSubmit = async (data) => {
//     // try {
//     //   await createRecipe(data);
//     //   toast.success('Техкарта создана!');
//     //   reset();
//     //   setOpen(false);
//     //   setStepStates({});

//     //   if (onCreated) onCreated();
//     // } catch (err) {
//     //   console.log(err);
//     //   toast.error('Ошибка при создании техкарты');
//     // }
//     try {
//     // Преобразуем шаги в нужный формат
//     const formData = {
//       ...data,
//       steps: data.steps.map((step, index) => ({
//         text: step.text,
//         stepNumber: index + 1,
//       })),
//     };

//     await createRecipe(formData);
//     toast.success('Техкарта создана!');
//     reset();
//     setOpen(false);
//     setStepStates({});

//     if (onCreated) onCreated();
//   } catch (err) {
//     console.log(err);
//     toast.error('Ошибка при создании техкарты');
//   }
//   };

//   const [totalCost, totalNetWeight] = useMemo(() => {
//     const ingredients = watch('ingredients') || [];
//     const productsMap = products.reduce((acc, p) => {
//       acc[p.id] = p;
//       return acc;
//     }, {});

//     const netWeight = ingredients.reduce((acc, ing) => {
//       return acc + Number(ing.quantityNet || 0);
//     }, 0);

//     const cost = ingredients.reduce((acc, ing) => {
//       const product = productsMap[ing.productId];
//       if (!product || !ing.quantityNet) return acc;
//       return acc + ((ing.quantityNet / 1000) * product.price || 0);
//     }, 0);

//     return [cost, netWeight];
//   }, [watch('ingredients'), products]);

//   return (
//     <div className="flex justify-center items-center">
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button>
//             <PlusIcon className="w-4 h-4 mr-2" />
//             Добавить ТехКарту
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Добавить техкарту</DialogTitle>
//             <DialogDescription>Укажите данные рецепта и ингредиенты</DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Название</Label>
//               <Input id="name" {...register('name', { required: true })} />
//             </div>

//             <div className='flex flex-wrap gap-2'>
//               <div className="grid gap-2">
//                 <Label htmlFor="type">Тип блюда</Label>
//                 <Controller
//                   control={control}
//                   name="type"
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Выберите тип блюда" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="first">Первые блюда</SelectItem>
//                         <SelectItem value="second">Вторые</SelectItem>
//                         <SelectItem value="desserts">Десерты</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="portionSize">Размер порции (гр)</Label>
//                 <Input
//                   id="portionSize"
//                   type="number"
//                   {...register('portionSize', { required: true })}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Инструкция</Label>
//               <div className="space-y-2">
//                 {stepFields.map((field, index) => {
//                   const stepState = stepStates[index] || { expanded: false, editing: false };
//                   const stepText = watch(`steps.${index}.text`);

//                   return (
//                     <div key={field.id} className="mx-2 border rounded-md overflow-hidden">
//                       <button
//                         type="button"
//                         onClick={() => toggleStep(index)}
//                         className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100"
//                       >
//                         <div className="flex items-center min-w-0">
//                           <span className="font-medium whitespace-nowrap">Шаг {index + 1}</span>
//                         </div>
//                         {stepState.expanded ? (
//                           <ChevronUpIcon className="h-4 w-4 flex-shrink-0" />
//                         ) : (
//                           <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
//                         )}
//                       </button>
//                       {stepState.expanded && (
//                         <div className="p-2 space-y-2">
//                           {stepState.editing ? (
//                             <>
//                               <div className=''>
//                                 <Textarea
//                                   {...register(`steps.${index}.text`, { required: true })}
//                                   placeholder={`Опишите шаг ${index + 1}`}
//                                   className="min-h-[50px] overflow-x-hidden break-all resize-y whitespace-pre-wrap"
//                                 />
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button
//                                   type="button"
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => {
//                                     handleStepState(index, { editing: false, expanded: false });
//                                   }}
//                                   className="flex-1"
//                                 >
//                                   <CheckIcon className="w-4 h-4 mr-1" />
//                                   Готово
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => removeStep(index)}
//                                   className="flex-1"
//                                 >
//                                   <TrashIcon className="w-4 h-4 mr-1" />
//                                   Удалить шаг
//                                 </Button>
//                               </div>
//                             </>
//                           ) : (
//                             <>
//                               <div className="p-2 bg-gray-50 rounded-md">
//                                 <p className="whitespace-pre-wrap">{stepText || 'Шаг без описания'}</p>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button
//                                   type="button"
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => handleStepState(index, { editing: true, expanded: true })}
//                                   className="flex-1"
//                                 >
//                                   <EditIcon className="w-4 h-4 mr-1" />
//                                   Редактировать
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => removeStep(index)}
//                                   className="flex-1"
//                                 >
//                                   <TrashIcon className="w-4 h-4 mr-1" />
//                                   Удалить шаг
//                                 </Button>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full mt-2"
//                   onClick={() => {
//                     const newIndex = stepFields.length;
//                     appendStep({ text: '' });
//                     handleStepState(newIndex, { expanded: true, editing: true });
//                   }}
//                 >
//                   + Добавить шаг
//                 </Button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Ингредиенты</Label>
//               {ingredientFields.map((field, index) => {
//                 const ingredientType = watch(`ingredients.${index}.type`);
//                 const filteredProducts = productsByType[ingredientType] || [];
//                 const selectedProductId = watch(`ingredients.${index}.productId`);
//                 const quantityNet = watch(`ingredients.${index}.quantityNet`);
                
//                 const selectedProduct = products.find(p => p.id === selectedProductId);
                
//                 const cost = selectedProduct && quantityNet
//                   ? ((quantityNet / 1000) * selectedProduct.price).toFixed(2)
//                   : 'Цена';

//                 return (
//                   <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
//                     <div className="flex flex-col sm:flex-row gap-2">
//                       <Controller
//                         control={control}
//                         name={`ingredients.${index}.type`}
//                         render={({ field }) => (
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Тип" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {nonEmptyIngredientTypes.map((type) => (
//                                 <SelectItem key={type} value={type}>
//                                   {type}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />

//                       <Controller
//                         control={control}
//                         name={`ingredients.${index}.productId`}
//                         render={({ field }) => (
//                           <Select 
//                             onValueChange={field.onChange} 
//                             value={field.value}
//                             disabled={!ingredientType}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Продукт" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {filteredProducts.map((product) => (
//                                 <SelectItem key={product.id} value={product.id}>
//                                   {product.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                     </div>

//                     <div className="flex gap-2 items-center">
//                       <Input
//                         type="number"
//                         placeholder="Брутто (г)"
//                         {...register(`ingredients.${index}.quantityGross`, { required: true })}
//                       />
//                       <Input
//                         type="number"
//                         placeholder="Нетто (г)"
//                         {...register(`ingredients.${index}.quantityNet`, { required: true })}
//                       />
//                       <div className="flex-1 flex flex-col gap-1">
//                   </div>
//                       {/* <div className="text-sm text-muted-foreground">
//                         {cost !== '-' ? `${cost} ₽` : '–'}
//                       </div> */}
//                       <div className="flex items-center gap-2 h-9 px-2 py-2 border rounded bg-muted">
//                         {cost}
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => removeIngredient(index)}
//                         className="justify-self-start"
//                       >
//                         <TrashIcon className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })}

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full mt-2"
//                 onClick={() =>
//                   appendIngredient({
//                     type: nonEmptyIngredientTypes[0] || '',
//                     productId: '',
//                     quantityGross: '',
//                     quantityNet: '',
//                   })
//                 }
//               >
//                 + Добавить ингредиент
//               </Button>

//               <div className="text-sm mt-4 text-right border-t pt-2">
//                 <p>Итоговая масса: <strong>{totalNetWeight} г</strong></p>
//                 <p>Итоговая стоимость: <strong>{totalCost.toFixed(2)} ₽</strong></p>
//               </div>
//             </div>

//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? 'Создание...' : 'Создать'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// 'use client';
// import {
//   Dialog,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogContent,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, EditIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { toast } from 'sonner';
// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getProducts } from '@/actions/products';
// import { createRecipe } from '@/actions/recipes';
// import { Textarea } from '@/components/ui/textarea';

// export default function RecipesControls({ onCreated }) {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [stepStates, setStepStates] = useState({});
//   const [addedIngredients, setAddedIngredients] = useState({});
  
//   const ingredientTypes = [
//     'Мясо, субпродукты',
//     'Рыба, морепродукты',
//     'Птица, яйца',
//     'Овощи, зелень',
//     'Фрукты, ягоды',
//     'Молочные продукты',
//     'Крупы, мука, хлеб',
//     'Макароны, изделия из теста',
//     'Специи, приправы',
//     'Сахар, сладости',
//     'Жиры, масла',
//     'Прочее',
//   ];

//   useEffect(() => {
//     getProducts().then(setProducts);
//   }, []);

//   // Фильтрация типов ингредиентов, у которых есть продукты
//   const nonEmptyIngredientTypes = useMemo(() => {
//     return ingredientTypes.filter(type => {
//       const productsOfType = products.filter(p => p.type === type);
//       return productsOfType.length > 0;
//     });
//   }, [products, ingredientTypes]);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     formState: { isSubmitting },
//   } = useForm({
//     defaultValues: {
//       name: '',
//       portionSize: '',
//       steps: [],
//       type: '',
//       ingredients: [],
//     },
//   });

//   const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
//     control,
//     name: 'ingredients',
//   });

//   const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
//     control,
//     name: 'steps',
//   });

//   const productsByType = useMemo(() => {
//     return products.reduce((acc, product) => {
//       if (!acc[product.type]) {
//         acc[product.type] = [];
//       }
//       acc[product.type].push(product);
//       return acc;
//     }, {});
//   }, [products]);

//   const toggleStep = (index) => {
//     setStepStates(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         expanded: !prev[index]?.expanded
//       }
//     }));
//   };

//   const handleStepState = (index, state) => {
//     setStepStates(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         ...state
//       }
//     }));
//   };

//   const toggleAddedIngredient = (index) => {
//     setAddedIngredients(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const onSubmit = async (data) => {
//     try {
//       const formData = {
//         ...data,
//         steps: data.steps.map((step, index) => ({
//           text: step.text,
//           stepNumber: index + 1,
//         })),
//       };

//       await createRecipe(formData);
//       toast.success('Техкарта создана!');
//       reset();
//       setOpen(false);
//       setStepStates({});
//       setAddedIngredients({});

//       if (onCreated) onCreated();
//     } catch (err) {
//       console.log(err);
//       toast.error('Ошибка при создании техкарты');
//     }
//   };

//   const [totalCost, totalNetWeight] = useMemo(() => {
//     const ingredients = watch('ingredients') || [];
//     const productsMap = products.reduce((acc, p) => {
//       acc[p.id] = p;
//       return acc;
//     }, {});

//     const netWeight = ingredients.reduce((acc, ing) => {
//       if (ing.unit === 'шт') {
//         return acc + (Number(ing.quantity) * Number(ing.unitWeight || 0));
//       }
//       return acc + Number(ing.quantityNet || 0);
//     }, 0);

//     const cost = ingredients.reduce((acc, ing) => {
//       const product = productsMap[ing.productId];
//       if (!product) return acc;
      
//       if (ing.unit === 'шт') {
//         return acc + (Number(ing.quantity) * product.price || 0);
//       }
//       return acc + ((ing.quantityNet / 1000) * product.price || 0);
//     }, 0);

//     return [cost, netWeight];
//   }, [watch('ingredients'), products]);

//   return (
//     <div className="flex justify-center items-center">
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button>
//             <PlusIcon className="w-4 h-4 mr-2" />
//             Добавить ТехКарту
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Добавить техкарту</DialogTitle>
//             <DialogDescription>Укажите данные рецепта и ингредиенты</DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Название</Label>
//               <Input id="name" {...register('name', { required: true })} />
//             </div>

//             <div className='flex flex-wrap gap-2'>
//               <div className="grid gap-2">
//                 <Label htmlFor="type">Тип блюда</Label>
//                 <Controller
//                   control={control}
//                   name="type"
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Выберите тип блюда" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="first">Первые блюда</SelectItem>
//                         <SelectItem value="second">Вторые</SelectItem>
//                         <SelectItem value="desserts">Десерты</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="portionSize">Размер порции (гр)</Label>
//                 <Input
//                   id="portionSize"
//                   type="number"
//                   {...register('portionSize', { required: true })}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Инструкция</Label>
//               <div className="space-y-2">
//                 {stepFields.map((field, index) => {
//                   const stepState = stepStates[index] || { expanded: false, editing: false };
//                   const stepText = watch(`steps.${index}.text`);

//                   return (
//                     <div key={field.id} className="mx-2 border rounded-md overflow-hidden">
//                       <button
//                         type="button"
//                         onClick={() => toggleStep(index)}
//                         className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100"
//                       >
//                         <div className="flex items-center min-w-0">
//                           <span className="font-medium whitespace-nowrap">Шаг {index + 1}</span>
//                         </div>
//                         {stepState.expanded ? (
//                           <ChevronUpIcon className="h-4 w-4 flex-shrink-0" />
//                         ) : (
//                           <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
//                         )}
//                       </button>
//                       {stepState.expanded && (
//                         <div className="p-2 space-y-2">
//                           {stepState.editing ? (
//                             <>
//                               <div className=''>
//                                 <Textarea
//                                   {...register(`steps.${index}.text`, { required: true })}
//                                   placeholder={`Опишите шаг ${index + 1}`}
//                                   className="min-h-[50px] overflow-x-hidden break-all resize-y whitespace-pre-wrap"
//                                 />
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button
//                                   type="button"
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => {
//                                     handleStepState(index, { editing: false, expanded: false });
//                                   }}
//                                   className="flex-1"
//                                 >
//                                   <CheckIcon className="w-4 h-4 mr-1" />
//                                   Готово
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => removeStep(index)}
//                                   className="flex-1"
//                                 >
//                                   <TrashIcon className="w-4 h-4 mr-1" />
//                                   Удалить шаг
//                                 </Button>
//                               </div>
//                             </>
//                           ) : (
//                             <>
//                               <div className="p-2 bg-gray-50 rounded-md">
//                                 <p className="whitespace-pre-wrap">{stepText || 'Шаг без описания'}</p>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button
//                                   type="button"
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => handleStepState(index, { editing: true, expanded: true })}
//                                   className="flex-1"
//                                 >
//                                   <EditIcon className="w-4 h-4 mr-1" />
//                                   Редактировать
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => removeStep(index)}
//                                   className="flex-1"
//                                 >
//                                   <TrashIcon className="w-4 h-4 mr-1" />
//                                   Удалить шаг
//                                 </Button>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full mt-2"
//                   onClick={() => {
//                     const newIndex = stepFields.length;
//                     appendStep({ text: '' });
//                     handleStepState(newIndex, { expanded: true, editing: true });
//                   }}
//                 >
//                   + Добавить шаг
//                 </Button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Label>Ингредиенты</Label>
//               {ingredientFields.map((field, index) => {
//                 const ingredientType = watch(`ingredients.${index}.type`);
//                 const filteredProducts = productsByType[ingredientType] || [];
//                 const selectedProductId = watch(`ingredients.${index}.productId`);
//                 const quantityNet = watch(`ingredients.${index}.quantityNet`);
//                 const quantityGross = watch(`ingredients.${index}.quantityGross`);
//                 const quantity = watch(`ingredients.${index}.quantity`);
                
//                 const selectedProduct = products.find(p => p.id === selectedProductId);
//                 console.log(selectedProduct)
//                 const isPiece = selectedProduct?.unit === 'шт';
                
//                 const cost = selectedProduct 
//                   ? isPiece
//                     ? (Number(quantity || 0) * selectedProduct.price).toFixed(2)
//                     : ((quantityNet / 1000) * selectedProduct.price).toFixed(2)
//                   : '0.00';

//                 if (addedIngredients[index]) {
//                   return (
//                     <div key={field.id} className="border p-2 rounded-md">
//                       <button
//                         type="button"
//                         onClick={() => toggleAddedIngredient(index)}
//                         className="w-full flex justify-between items-center"
//                       >
//                         <span className="font-medium">
//                           {selectedProduct?.name || 'Ингредиент'} - {isPiece ? `${quantity} шт` : `${quantityNet} г`}
//                         </span>
//                         <ChevronDownIcon className="h-4 w-4" />
//                       </button>
//                     </div>
//                   );
//                 }

//                 return (
//                   <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
//                     <div className="flex flex-col sm:flex-row gap-2">
//                       <Controller
//                         control={control}
//                         name={`ingredients.${index}.type`}
//                         render={({ field }) => (
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Тип" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {nonEmptyIngredientTypes.map((type) => (
//                                 <SelectItem key={type} value={type}>
//                                   {type}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />

//                       <Controller
//                         control={control}
//                         name={`ingredients.${index}.productId`}
//                         render={({ field }) => (
//                           <Select 
//                             onValueChange={field.onChange} 
//                             value={field.value}
//                             disabled={!ingredientType}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Продукт">
//                                 {selectedProduct ? `${selectedProduct.name}, ${selectedProduct.unit}` : 'Продукт'}
//                               </SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                               {filteredProducts.map((product) => (
//                                 <SelectItem key={product.id} value={product.id}>
//                                   {product.name}, {product.unit}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                     </div>

//                     {isPiece ? (
//                       <>
//                         <div className="flex gap-2 items-center">
//                           <Input
//                             type="number"
//                             placeholder="Количество"
//                             {...register(`ingredients.${index}.quantity`, { required: true })}
//                           />
//                           <Input
//                             type="number"
//                             placeholder=""
//                             value={selectedProduct?.weightPerUnit * quantity || ''}
//                             disabled
//                           />
//                           <div className="flex-1 flex flex-col gap-1">
//                           </div>
//                           <div className="flex items-center gap-2 h-9 px-2 py-2 border rounded bg-muted">
//                             {cost} ₽
//                           </div>  
//                         </div>
//                         <div className='flex items-center gap-2'>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => toggleAddedIngredient(index)}
//                             className="justify-self-start"
//                           >
//                             <CheckIcon className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => removeIngredient(index)}
//                             className="justify-self-start"
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex gap-2 items-center">
//                           <Input
//                             type="number"
//                             placeholder="Брутто (г)"
//                             {...register(`ingredients.${index}.quantityGross`, { required: true })}
//                           />
//                           <Input
//                             type="number"
//                             placeholder="Нетто (г)"
//                             {...register(`ingredients.${index}.quantityNet`, { required: true })}
//                           />
//                           <div className="flex-1 flex flex-col gap-1">
//                           </div>
//                           <div className="flex items-center gap-2 h-9 px-2 py-2 border rounded bg-muted">
//                             {cost} ₽
//                           </div>
//                         </div>
//                         <div className='flex gap-2'>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => toggleAddedIngredient(index)}
//                             className="justify-self-start"
//                           >
//                             <CheckIcon className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => removeIngredient(index)}
//                             className="justify-self-start"
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full mt-2"
//                 onClick={() =>
//                   appendIngredient({
//                     type: nonEmptyIngredientTypes[0] || '',
//                     productId: '',
//                     quantityGross: '',
//                     quantityNet: '',
//                     quantity: '',
//                   })
//                 }
//               >
//                 + Добавить ингредиент
//               </Button>

//               <div className="text-sm mt-4 text-right border-t pt-2">
//                 <p>Итоговая масса: <strong>{totalNetWeight} г</strong></p>
//                 <p>Итоговая стоимость: <strong>{totalCost.toFixed(2)} ₽</strong></p>
//               </div>
//             </div>

//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? 'Создание...' : 'Создать'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
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
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, EditIcon } from 'lucide-react';
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
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/actions/products';
import { createRecipe } from '@/actions/recipes';
import { Textarea } from '@/components/ui/textarea';

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
      steps: [{ text: '' }],
      type: '',
      ingredients: [{
        type: nonEmptyIngredientTypes.length > 0 ? nonEmptyIngredientTypes[0] : '',
        productId: '',
        quantityGross: 0,
        quantityNet: 0,
        quantity: 0,
        unit: '',
        unitWeight: 0
      }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps',
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

  const toggleStep = (index) => {
    setStepStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        expanded: !prev[index]?.expanded
      }
    }));
  };

  const handleStepState = (index, state) => {
    setStepStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        ...state
      }
    }));
  };

  const toggleAddedIngredient = (index) => {
    setAddedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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

            <div className="flex flex-col gap-2">
              <Label>Инструкция</Label>
              <div className="space-y-2">
                {stepFields.map((field, index) => {
                  const stepState = stepStates[index] || { expanded: false, editing: false };
                  const stepText = watch(`steps.${index}.text`) || '';

                  return (
                    <div key={field.id} className="mx-2 border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex items-center min-w-0">
                          <span className="font-medium whitespace-nowrap">Шаг {index + 1}</span>
                        </div>
                        {stepState.expanded ? (
                          <ChevronUpIcon className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                      {stepState.expanded && (
                        <div className="p-2 space-y-2">
                          {stepState.editing ? (
                            <>
                              <div className=''>
                                <Textarea
                                  {...register(`steps.${index}.text`, { required: true })}
                                  placeholder={`Опишите шаг ${index + 1}`}
                                  className="min-h-[50px] overflow-x-hidden break-all resize-y whitespace-pre-wrap"
                                  value={stepText}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    handleStepState(index, { editing: false, expanded: false });
                                  }}
                                  className="flex-1"
                                >
                                  <CheckIcon className="w-4 h-4 mr-1" />
                                  Готово
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeStep(index)}
                                  className="flex-1"
                                >
                                  <TrashIcon className="w-4 h-4 mr-1" />
                                  Удалить шаг
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 bg-gray-50 rounded-md">
                                <p className="whitespace-pre-wrap">{stepText || 'Шаг без описания'}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleStepState(index, { editing: true, expanded: true })}
                                  className="flex-1"
                                >
                                  <EditIcon className="w-4 h-4 mr-1" />
                                  Редактировать
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeStep(index)}
                                  className="flex-1"
                                >
                                  <TrashIcon className="w-4 h-4 mr-1" />
                                  Удалить шаг
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    const newIndex = stepFields.length;
                    appendStep({ text: '' });
                    handleStepState(newIndex, { expanded: true, editing: true });
                  }}
                >
                  + Добавить шаг
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Ингредиенты</Label>
              {ingredientFields.map((field, index) => {
                const ingredientType = watch(`ingredients.${index}.type`) || '';
                const filteredProducts = productsByType[ingredientType] || [];
                const selectedProductId = watch(`ingredients.${index}.productId`) || '';
                const quantityNet = watch(`ingredients.${index}.quantityNet`) || 0;
                const quantityGross = watch(`ingredients.${index}.quantityGross`) || 0;
                const quantity = watch(`ingredients.${index}.quantity`) || 0;
                
                const selectedProduct = products.find(p => p.id === selectedProductId);
                const isPiece = selectedProduct?.unit === 'шт';
                
                const calculateCost = () => {
                  if (!selectedProduct) return 0;
                  
                  if (isPiece) {
                    return quantity * (selectedProduct.price / selectedProduct.quantity);
                  } else {
                    return (quantityGross / 1000) * (selectedProduct.price / selectedProduct.quantity);
                  }
                };

                const cost = calculateCost();

                if (addedIngredients[index]) {
                  return (
                    <div key={field.id} className="border p-2 rounded-md">
                      <button
                        type="button"
                        onClick={() => toggleAddedIngredient(index)}
                        className="w-full flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {selectedProduct?.name || 'Ингредиент'} - {isPiece ? `${quantity} шт` : `${quantityNet} г`}
                        </span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Controller
                        control={control}
                        name={`ingredients.${index}.type`}
                        render={({ field }) => (
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Тип" />
                            </SelectTrigger>
                            <SelectContent>
                              {nonEmptyIngredientTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`ingredients.${index}.productId`}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              const product = products.find(p => p.id === value);
                              if (product) {
                                setValue(`ingredients.${index}.unit`, product.unit);
                                if (product.unit === 'шт') {
                                  setValue(`ingredients.${index}.unitWeight`, product.weightPerUnit || 0);
                                }
                              }
                            }}
                            value={field.value}
                            disabled={!ingredientType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Продукт">
                                {selectedProduct ? `${selectedProduct.name}, ${selectedProduct.unit}` : 'Продукт'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {filteredProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}, {product.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {isPiece ? (
                      <>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Количество"
                            {...register(`ingredients.${index}.quantity`, { 
                              required: true,
                              valueAsNumber: true 
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Вес"
                            value={((selectedProduct?.weightPerUnit || 0) * (quantity || 0)).toFixed(2)}
                            disabled
                          />
                          <Input
                            type="number"
                            placeholder="Цена"
                            value={cost.toFixed(2)}
                            disabled
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => toggleAddedIngredient(index)}
                            className="justify-self-start"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                            className="justify-self-start"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Брутто (г)"
                            {...register(`ingredients.${index}.quantityGross`, { 
                              required: true,
                              valueAsNumber: true 
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Нетто (г)"
                            {...register(`ingredients.${index}.quantityNet`, { 
                              required: true,
                              valueAsNumber: true 
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Цена"
                            value={cost.toFixed(2)}
                            disabled
                          />
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => toggleAddedIngredient(index)}
                            className="justify-self-start"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                            className="justify-self-start"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  appendIngredient({
                    type: nonEmptyIngredientTypes[0] || '',
                    productId: '',
                    quantityGross: 0,
                    quantityNet: 0,
                    quantity: 0,
                    unit: '',
                    unitWeight: 0
                  })
                }
              >
                + Добавить ингредиент
              </Button>

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