'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducedItems, createProducedItem, getPendingTasks } from '@/actions/produced';
import { getAllRecipes } from '@/actions/recipes';

export default function Production() {
  const [date, setDate] = useState(new Date());
  const [producedItems, setProducedItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      recipeId: '',
      taskId: '',
      portions: 1
    }
  });

  const selectedRecipeId = watch('recipeId');

  useEffect(() => {
    loadData();
  }, [date]);

  useEffect(() => {
    if (selectedTask) {
      setValue('recipeId', selectedTask.recipe.id);
      setValue('taskId', selectedTask.task.id);
    } else {
      setValue('taskId', '');
    }
  }, [selectedTask, setValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const [items, allRecipes, pendingTasks] = await Promise.all([
        getProducedItems(formattedDate),
        getAllRecipes(),
        getPendingTasks()
      ]);
      
      setProducedItems(items);
      setRecipes(allRecipes);
      setTasks(pendingTasks);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      await createProducedItem({
        ...data,
        date: formattedDate,
        portions: Number(data.portions)
      });
      
      await loadData();
      reset();
      setSelectedTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setValue('portions', task.task.portionsPlanned);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Добавить произведенную продукцию</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Дата</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Задача (необязательно)</label>
                <Select onValueChange={(value) => handleTaskSelect(tasks.find(t => t.task.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите задачу" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.task.id} value={task.task.id}>
                        {task.recipe.name} ({task.task.portionsPlanned} порций на {format(new Date(task.task.date), 'dd.MM.yyyy')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Рецепт</label>
                <Select 
                  value={selectedRecipeId}
                  onValueChange={(value) => setValue('recipeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите рецепт" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Количество порций</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  {...register('portions', { 
                    required: 'Укажите количество порций',
                    min: { value: 1, message: 'Минимум 1 порция' }
                  })}
                />
                {errors.portions && (
                  <p className="text-sm text-red-500">{errors.portions.message}</p>
                )}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Добавить'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Произведенная продукция за {format(date, 'dd.MM.yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Загрузка...</p>
          ) : producedItems.length === 0 ? (
            <p>Нет данных о производстве за выбранную дату</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Рецепт</TableHead>
                  <TableHead>Порций</TableHead>
                  <TableHead>Время производства</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {producedItems.map((item) => (
                  <TableRow key={item.produced.id}>
                    <TableCell>{item.recipe.name}</TableCell>
                    <TableCell>{item.produced.portions}</TableCell>
                    <TableCell>
                      {format(new Date(item.produced.createdAt), 'HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}