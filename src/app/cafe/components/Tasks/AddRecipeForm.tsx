'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createRecipeAction } from '@/actions/recipes';
import { getProducts } from '@/actions/products';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddRecipeForm({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [howTo, setHowTo] = useState('');
  const [ingredients, setIngredients] = useState([{ productId: '', quantity: '', unit: 'гр' }]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { productId: '', quantity: '', unit: 'гр' }]);
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createRecipeAction({
      name,
      portionSize,
      howTo,
      ingredients,
    });

    if (result.success) {
      toast.success('Техкарта добавлена');
      onClose?.();
    } else {
      toast.error(result.message || 'Ошибка при добавлении');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Название</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portionSize">Размер порции (гр)</Label>
        <Input id="portionSize" type="number" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="howTo">Инструкция (необязательно)</Label>
        <Input id="howTo" value={howTo} onChange={(e) => setHowTo(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label>Ингредиенты</Label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center">
            <Select
              value={ingredient.productId}
              onValueChange={(value) => handleIngredientChange(index, 'productId', value)}
            >
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

            <Input
              type="number"
              placeholder="Кол-во"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            />

            <Input
              placeholder="Ед."
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            />
          </div>
        ))}

        <Button type="button" onClick={handleAddIngredient} variant="outline" className="mt-2">
          + Добавить ингредиент
        </Button>
      </div>

      <Button type="submit">Создать</Button>
    </form>
  );
}
