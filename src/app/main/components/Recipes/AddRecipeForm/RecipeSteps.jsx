'use client';

import { ChevronDownIcon, ChevronUpIcon, TrashIcon, EditIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFieldArray } from 'react-hook-form';

export function RecipeSteps({ control, register, watch, setStepStates, stepStates }) {
  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps',
  });

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

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Инструкция</label>
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
  );
}