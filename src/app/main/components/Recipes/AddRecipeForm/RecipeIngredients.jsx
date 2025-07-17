// 'use client';

// import { ChevronDownIcon, CheckIcon, TrashIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Controller, useFieldArray } from 'react-hook-form';
// import { useMemo } from 'react';

// export function RecipeIngredients({ 
//   control, 
//   register, 
//   watch, 
//   setValue, 
//   products, 
//   productsByType, 
//   nonEmptyIngredientTypes,
//   addedIngredients,
//   setAddedIngredients,
//   totalCost,
//   totalNetWeight
// }) {
//   const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
//     control,
//     name: 'ingredients',
//   });

//   const toggleAddedIngredient = (index) => {
//     setAddedIngredients(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const handleTypeChange = (index, newType) => {
//     setValue(`ingredients.${index}.productId`, '');
//     setValue(`ingredients.${index}.unit`, '');
//     setValue(`ingredients.${index}.unitWeight`, 0);
//     setValue(`ingredients.${index}.quantityGross`, 1000);
//     setValue(`ingredients.${index}.quantityNet`, 1000);
//     setValue(`ingredients.${index}.quantity`, 0);
//   };

//   const handleProductChange = (index, productId) => {
//     const product = products.find(p => p.id === productId);
//     if (product) {
//       setValue(`ingredients.${index}.unit`, product.unit);
//       setValue(`ingredients.${index}.unitWeight`, product.weightPerUnit || 0);
      
//       if (product.unit === 'шт') {
//         setValue(`ingredients.${index}.quantity`, 1);
//         setValue(`ingredients.${index}.quantityNet`, product.weightPerUnit || 0);
//         setValue(`ingredients.${index}.quantityGross`, product.weightPerUnit || 0);
//       } else {
//         setValue(`ingredients.${index}.quantityGross`, 1000);
//         setValue(`ingredients.${index}.quantityNet`, 1000);
//         setValue(`ingredients.${index}.quantity`, 0);
//       }
//     }
//   };

//   const getIngredientValues = (index) => {
//     const values = watch(`ingredients.${index}`) || {};
//     return {
//       type: values.type || '',
//       productId: values.productId || '',
//       quantityNet: Number(values.quantityNet) || 0,
//       quantityGross: Number(values.quantityGross) || 0,
//       quantity: Number(values.quantity) || 0,
//       unit: values.unit || '',
//       unitWeight: Number(values.unitWeight) || 0
//     };
//   };

//   const calculateIngredientCost = (ingredient, product) => {
//     if (!product) return 0;
    
//     if (ingredient.unit === 'шт') {
//       return ingredient.quantity * (product.price / product.quantity);
//     } else {
//       return (ingredient.quantityGross / 1000) * (product.price / product.quantity);
//     }
//   };

//   const calculateIngredientWeight = (ingredient, product) => {
//     if (!product) return 0;
    
//     if (ingredient.unit === 'шт') {
//       return ingredient.quantity * (product.weightPerUnit || 0);
//     } else {
//       return ingredient.quantityNet;
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <label className="text-sm font-medium">Ингредиенты</label>
//       {ingredientFields.map((field, index) => {
//         const ingredient = getIngredientValues(index);
//         const filteredProducts = productsByType[ingredient.type] || [];
//         const selectedProduct = products.find(p => p.id === ingredient.productId);
//         const isPiece = ingredient.unit === 'шт';
//         const cost = selectedProduct ? calculateIngredientCost(ingredient, selectedProduct) : 0;
//         const weight = selectedProduct ? calculateIngredientWeight(ingredient, selectedProduct) : 0;

//         if (addedIngredients[index]) {
//           return (
//             <div key={field.id} className="border p-2 rounded-md">
//               <button
//                 type="button"
//                 onClick={() => toggleAddedIngredient(index)}
//                 className="w-full flex justify-between items-center"
//               >
//                 <span className="font-medium">
//                   {selectedProduct?.name || 'Ингредиент'} - {isPiece ? `${ingredient.quantity} шт` : `${ingredient.quantityNet} г`}
//                 </span>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </button>
//             </div>
//           );
//         }

//         return (
//           <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
//             <div className="flex flex-col sm:flex-row gap-2">
//               <Controller
//                 control={control}
//                 name={`ingredients.${index}.type`}
//                 render={({ field }) => (
//                   <Select 
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleTypeChange(index, value);
//                     }}
//                     value={field.value}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Тип" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {nonEmptyIngredientTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name={`ingredients.${index}.productId`}
//                 render={({ field }) => (
//                   <Select 
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleProductChange(index, value);
//                     }}
//                     value={field.value}
//                     disabled={!ingredient.type}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Продукт">
//                         {selectedProduct ? `${selectedProduct.name}, ${selectedProduct.unit}` : 'Продукт'}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filteredProducts.map((product) => (
//                         <SelectItem key={product.id} value={product.id}>
//                           {product.name}, {product.unit}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>

//             {isPiece ? (
//               <>
//                 <div className="grid grid-cols-3 gap-2 items-center">
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Количество</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantity`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantity}
//                       onChange={(e) => {
//                         const newQuantity = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantity`, newQuantity);
//                         setValue(`ingredients.${index}.quantityNet`, newQuantity * ingredient.unitWeight);
//                         setValue(`ingredients.${index}.quantityGross`, newQuantity * ingredient.unitWeight);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Вес (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={weight.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Цена (₽)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={cost.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className='flex justify-center gap-2'>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => toggleAddedIngredient(index)}
//                     className="justify-self-start"
//                     disabled={!ingredient.productId}
//                   >
//                     <CheckIcon className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => removeIngredient(index)}
//                     className="justify-self-start"
//                   >
//                     <TrashIcon className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="grid grid-cols-3 gap-2 items-center">
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Брутто (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantityGross`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantityGross}
//                       onChange={(e) => {
//                         const newGross = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantityGross`, newGross);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Нетто (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantityNet`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantityNet}
//                       onChange={(e) => {
//                         const newNet = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantityNet`, newNet);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Цена (₽)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={cost.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className='flex justify-center gap-2'>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => toggleAddedIngredient(index)}
//                     className="justify-self-start"
//                     disabled={!ingredient.productId}
//                   >
//                     <CheckIcon className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => removeIngredient(index)}
//                     className="justify-self-start"
//                   >
//                     <TrashIcon className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         );
//       })}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full mt-2"
//         onClick={() =>
//           appendIngredient({
//             type: '',
//             productId: '',
//             quantityGross: 1000,
//             quantityNet: 1000,
//             quantity: 1,
//             unit: '',
//             unitWeight: 0
//           })
//         }
//       >
//         + Добавить ингредиент
//       </Button>

//       <div className="text-sm mt-4 text-right border-t pt-2">
//         <p>Итоговая масса: <strong>{totalNetWeight} г</strong></p>
//         <p>Итоговая стоимость: <strong>{totalCost.toFixed(2)} ₽</strong></p>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { ChevronDownIcon, CheckIcon, TrashIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Controller, useFieldArray } from 'react-hook-form';
// import { useMemo } from 'react';

// export function RecipeIngredients({ 
//   control, 
//   register, 
//   watch, 
//   setValue, 
//   products, 
//   productsByType, 
//   nonEmptyIngredientTypes,
//   addedIngredients,
//   setAddedIngredients
// }) {
//   const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
//     control,
//     name: 'ingredients',
//   });

//   // Рассчитываем итоговые значения только для добавленных ингредиентов
//   const [totalCost, totalNetWeight] = useMemo(() => {
//     const ingredients = watch('ingredients') || [];
//     const productsMap = products.reduce((acc, p) => {
//       acc[p.id] = p;
//       return acc;
//     }, {});

//     let netWeight = 0;
//     let cost = 0;

//     ingredients.forEach((ing, index) => {
//       if (addedIngredients[index]) {
//         const product = productsMap[ing.productId];
//         if (!product) return;

//         if (ing.unit === 'шт') {
//           // Для штучных продуктов
//           const quantity = Number(ing.quantity) || 0;
//           const unitWeight = Number(ing.unitWeight) || 0;
//           netWeight += quantity * unitWeight;
//           cost += quantity * (product.price || 0);
//         } else {
//           // Для весовых продуктов
//           const quantityNet = Number(ing.quantityNet) || 0;
//           netWeight += quantityNet;
//           cost += (quantityNet / 1000) * (product.price || 0);
//         }
//       }
//     });

//     return [cost, netWeight];
//   }, [watch('ingredients'), products, addedIngredients]);

//   const toggleAddedIngredient = (index) => {
//     setAddedIngredients(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const handleTypeChange = (index, newType) => {
//     // Сбрасываем связанные значения при изменении типа
//     setValue(`ingredients.${index}.productId`, '');
//     setValue(`ingredients.${index}.unit`, '');
//     setValue(`ingredients.${index}.unitWeight`, 0);
//     setValue(`ingredients.${index}.quantityGross`, 1000);
//     setValue(`ingredients.${index}.quantityNet`, 1000);
//     setValue(`ingredients.${index}.quantity`, 0);
//   };

//   const handleProductChange = (index, productId) => {
//     const product = products.find(p => p.id === productId);
//     if (product) {
//       setValue(`ingredients.${index}.unit`, product.unit);
//       setValue(`ingredients.${index}.unitWeight`, product.weightPerUnit || 0);
      
//       // Устанавливаем начальные значения в зависимости от типа продукта
//       if (product.unit === 'шт') {
//         setValue(`ingredients.${index}.quantity`, 1);
//         setValue(`ingredients.${index}.quantityNet`, product.weightPerUnit || 0);
//         setValue(`ingredients.${index}.quantityGross`, product.weightPerUnit || 0);
//       } else {
//         setValue(`ingredients.${index}.quantityGross`, 1000);
//         setValue(`ingredients.${index}.quantityNet`, 1000);
//         setValue(`ingredients.${index}.quantity`, 0);
//       }
//     }
//   };

//   const getIngredientValues = (index) => {
//     const values = watch(`ingredients.${index}`) || {};
//     return {
//       type: values.type || '',
//       productId: values.productId || '',
//       quantityNet: Number(values.quantityNet) || 0,
//       quantityGross: Number(values.quantityGross) || 0,
//       quantity: Number(values.quantity) || 0,
//       unit: values.unit || '',
//       unitWeight: Number(values.unitWeight) || 0
//     };
//   };

//   const calculateIngredientCost = (ingredient, product) => {
//     if (!product) return 0;
//     return ingredient.unit === 'шт' 
//       ? ingredient.quantity * (product.price || 0)
//       : (ingredient.quantityNet / 1000) * (product.price || 0);
//   };

//   const calculateIngredientWeight = (ingredient, product) => {
//     if (!product) return 0;
//     return ingredient.unit === 'шт' 
//       ? ingredient.quantity * (product.weightPerUnit || 0)
//       : ingredient.quantityNet;
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <label className="text-sm font-medium">Ингредиенты</label>
      
//       {ingredientFields.map((field, index) => {
//         const ingredient = getIngredientValues(index);
//         const filteredProducts = productsByType[ingredient.type] || [];
//         const selectedProduct = products.find(p => p.id === ingredient.productId);
//         const isPiece = ingredient.unit === 'шт';
//         const cost = selectedProduct ? calculateIngredientCost(ingredient, selectedProduct) : 0;
//         const weight = selectedProduct ? calculateIngredientWeight(ingredient, selectedProduct) : 0;

//         if (addedIngredients[index]) {
//           return (
//             <div key={field.id} className="border p-2 rounded-md">
//               <button
//                 type="button"
//                 onClick={() => toggleAddedIngredient(index)}
//                 className="w-full flex justify-between items-center"
//               >
//                 <span className="font-medium">
//                   {selectedProduct?.name || 'Ингредиент'} - {isPiece ? `${ingredient.quantity} шт` : `${ingredient.quantityNet} г`}
//                 </span>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </button>
//             </div>
//           );
//         }

//         return (
//           <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
//             <div className="flex flex-col sm:flex-row gap-2">
//               <Controller
//                 control={control}
//                 name={`ingredients.${index}.type`}
//                 render={({ field }) => (
//                   <Select 
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleTypeChange(index, value);
//                     }}
//                     value={field.value}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Тип" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {nonEmptyIngredientTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name={`ingredients.${index}.productId`}
//                 render={({ field }) => (
//                   <Select 
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       handleProductChange(index, value);
//                     }}
//                     value={field.value}
//                     disabled={!ingredient.type}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Продукт">
//                         {selectedProduct ? `${selectedProduct.name}, ${selectedProduct.unit}` : 'Продукт'}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filteredProducts.map((product) => (
//                         <SelectItem key={product.id} value={product.id}>
//                           {product.name}, {product.unit}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>

//             {isPiece ? (
//               <>
//                 <div className="grid grid-cols-3 gap-2 items-center">
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Количество</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantity`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantity}
//                       onChange={(e) => {
//                         const newQuantity = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantity`, newQuantity);
//                         setValue(`ingredients.${index}.quantityNet`, newQuantity * ingredient.unitWeight);
//                         setValue(`ingredients.${index}.quantityGross`, newQuantity * ingredient.unitWeight);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Вес (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={weight.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Цена (₽)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={cost.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="grid grid-cols-3 gap-2 items-center">
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Брутто (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantityGross`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantityGross}
//                       onChange={(e) => {
//                         const newGross = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantityGross`, newGross);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Нетто (г)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register(`ingredients.${index}.quantityNet`, { 
//                         required: true,
//                         valueAsNumber: true,
//                         min: 0
//                       })}
//                       value={ingredient.quantityNet}
//                       onChange={(e) => {
//                         const newNet = Number(e.target.value) || 0;
//                         setValue(`ingredients.${index}.quantityNet`, newNet);
//                       }}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs text-muted-foreground">Цена (₽)</label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       value={cost.toFixed(2)}
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
            
//             <div className='flex justify-center gap-2'>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => toggleAddedIngredient(index)}
//                 className="justify-self-start"
//                 disabled={!ingredient.productId}
//               >
//                 <CheckIcon className="w-4 h-4" />
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => removeIngredient(index)}
//                 className="justify-self-start"
//               >
//                 <TrashIcon className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         );
//       })}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full mt-2"
//         onClick={() =>
//           appendIngredient({
//             type: '',
//             productId: '',
//             quantityGross: 1000,
//             quantityNet: 1000,
//             quantity: 1,
//             unit: '',
//             unitWeight: 0
//           })
//         }
//       >
//         + Добавить ингредиент
//       </Button>

//       <div className="text-sm mt-4 text-right border-t pt-2">
//         <p>Итоговая масса: <strong>{totalNetWeight} г</strong></p>
//         <p>Итоговая стоимость: <strong>{totalCost.toFixed(2)} ₽</strong></p>
//       </div>
//     </div>
//   );
// }



'use client';

import { ChevronDownIcon, CheckIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';

export function RecipeIngredients({ 
  control, 
  register, 
  watch, 
  setValue, 
  products, 
  productsByType, 
  nonEmptyIngredientTypes,
  addedIngredients,
  setAddedIngredients
}) {
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const calculateIngredientCost = (ingredient, product) => {
    if (!product) return 0;
    return ingredient.unit === 'шт' 
      ? ingredient.quantity * ((product.price / product.quantity) || 0)
      : (ingredient.quantityNet / 1000) * (product.price || 0);
  };

  const calculateIngredientWeight = (ingredient, product) => {
    if (!product) return 0;
    return ingredient.unit === 'шт' 
      ? ingredient.quantity * (product.weightPerUnit || 0)
      : ingredient.quantityNet;
  };

  const [totalCost, totalNetWeight] = useMemo(() => {
    const ingredients = watch('ingredients') || [];
    const productsMap = products.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return ingredients.reduce((acc, ing, index) => {
      if (!addedIngredients[index]) return acc;
      
      const product = productsMap[ing.productId];
      if (!product) return acc;

      return [
        acc[0] + calculateIngredientCost(ing, product),
        acc[1] + calculateIngredientWeight(ing, product)
      ];
    }, [0, 0]);
  }, [watch('ingredients'), products, addedIngredients]);

  const toggleAddedIngredient = (index) => {
    setAddedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleTypeChange = (index, newType) => {
    setValue(`ingredients.${index}.productId`, '');
    setValue(`ingredients.${index}.unit`, '');
    setValue(`ingredients.${index}.unitWeight`, 0);
    setValue(`ingredients.${index}.quantityGross`, 1000);
    setValue(`ingredients.${index}.quantityNet`, 1000);
    setValue(`ingredients.${index}.quantity`, 0);
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === productId);
    console.log(product)
    if (product) {
      setValue(`ingredients.${index}.unit`, product.unit);
      setValue(`ingredients.${index}.unitWeight`, product.weightPerUnit || 0);
      
      if (product.unit === 'шт') {
        setValue(`ingredients.${index}.quantity`, 1);
        setValue(`ingredients.${index}.quantityNet`, product.weightPerUnit || 0);
        setValue(`ingredients.${index}.quantityGross`, product.weightPerUnit || 0);
      } else {
        setValue(`ingredients.${index}.quantityGross`, 1000);
        setValue(`ingredients.${index}.quantityNet`, 1000);
        setValue(`ingredients.${index}.quantity`, 0);
      }
    }
  };

  const getIngredientValues = (index) => {
    const values = watch(`ingredients.${index}`) || {};
    return {
      type: values.type || '',
      productId: values.productId || '',
      quantityNet: Number(values.quantityNet) || 0,
      quantityGross: Number(values.quantityGross) || 0,
      quantity: Number(values.quantity) || 0,
      unit: values.unit || '',
      unitWeight: Number(values.unitWeight) || 0
    };
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Ингредиенты</label>
      
      {ingredientFields.map((field, index) => {
        const ingredient = getIngredientValues(index);
        const filteredProducts = productsByType[ingredient.type] || [];
        const selectedProduct = products.find(p => p.id === ingredient.productId);
        const isPiece = ingredient.unit === 'шт';
        const cost = selectedProduct ? calculateIngredientCost(ingredient, selectedProduct) : 0;
        const weight = selectedProduct ? calculateIngredientWeight(ingredient, selectedProduct) : 0;

        if (addedIngredients[index]) {
          return (
            <div key={field.id} className="border p-2 rounded-md">
              <button
                type="button"
                onClick={() => toggleAddedIngredient(index)}
                className="w-full flex justify-between items-center"
              >
                <span className="font-medium">
                  {selectedProduct?.name || 'Ингредиент'} - {isPiece ? `${ingredient.quantity} шт` : `${ingredient.quantityNet} г`}
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTypeChange(index, value);
                    }}
                    value={field.value}
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
                      handleProductChange(index, value);
                    }}
                    value={field.value}
                    disabled={!ingredient.type}
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
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Количество</label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(`ingredients.${index}.quantity`, { 
                        required: true,
                        valueAsNumber: true,
                        min: 0
                      })}
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value) || 0;
                        setValue(`ingredients.${index}.quantity`, newQuantity);
                        setValue(`ingredients.${index}.quantityNet`, newQuantity * ingredient.unitWeight);
                        setValue(`ingredients.${index}.quantityGross`, newQuantity * ingredient.unitWeight);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Вес (г)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={weight.toFixed(2)}
                      disabled
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Цена (₽)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={cost.toFixed(2)}
                      disabled
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Брутто (г)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(`ingredients.${index}.quantityGross`, { 
                        required: true,
                        valueAsNumber: true,
                        min: 0
                      })}
                      value={ingredient.quantityGross}
                      onChange={(e) => {
                        const newGross = Number(e.target.value) || 0;
                        setValue(`ingredients.${index}.quantityGross`, newGross);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Нетто (г)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(`ingredients.${index}.quantityNet`, { 
                        required: true,
                        valueAsNumber: true,
                        min: 0
                      })}
                      value={ingredient.quantityNet}
                      onChange={(e) => {
                        const newNet = Number(e.target.value) || 0;
                        setValue(`ingredients.${index}.quantityNet`, newNet);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Цена (₽)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={cost.toFixed(2)}
                      disabled
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className='flex justify-center gap-2'>
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggleAddedIngredient(index)}
                className="justify-self-start"
                disabled={!ingredient.productId}
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
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        className="w-full mt-2"
        onClick={() =>
          appendIngredient({
            type: '',
            productId: '',
            quantityGross: 1000,
            quantityNet: 1000,
            quantity: 1,
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
  );
}