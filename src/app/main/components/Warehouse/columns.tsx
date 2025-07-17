"use client"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import Link from "next/link"

export type Products = {
  id: number
  name: string
  type: string
  quantity: number
  unit: string
  price: number
  weightPerUnit: number,
  totalWeight: number, 
}

export const columns: ColumnDef<Products>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Название
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Тип
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true
      return value.includes(row.getValue(id))
    },
  },
  {
  accessorKey: "quantity",
  header: ({ column, table }) => {
    return (
      <div className="flex flex-col space-y-2">
        <Button 
          variant="ghost" 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Количество
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        {/* <Input
          placeholder="Фильтр по весу..."
          value={(table.getColumn("totalWeight")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("totalWeight")?.setFilterValue(event.target.value)
          }
          className="max-w-xs h-8"
        /> */}
      </div>
    )
  },
  cell: ({ row }) => {
    const { quantity, unit, weightPerUnit, totalWeight } = row.original;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col">
            <span>{quantity} {unit}</span>
            {unit === 'шт' && weightPerUnit && (
              <span className="text-xs text-muted-foreground">
                {totalWeight} кг всего
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {unit === 'шт' 
            ? `Масса единицы: ${weightPerUnit} кг` 
            : `Общая масса: ${totalWeight} кг`}
        </TooltipContent>
      </Tooltip>
    );
  },
  filterFn: (row, id, value) => {
    // Фильтрация по общему весу
    const totalWeight = row.original.totalWeight;
    if (!value) return true;
    return String(totalWeight).includes(value);
  },
},
//   {
//   accessorKey: "quantity",
//   header: "Количество",
//   cell: ({ row }) => {
//     const { quantity, unit, weightPerUnit, totalWeight } = row.original;
    
//     return (
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <div className="flex flex-col">
//             <span>{quantity} {unit}</span>
//             {unit === 'шт' && weightPerUnit && (
//               <span className="text-xs text-muted-foreground">
//                 {totalWeight} кг всего
//               </span>
//             )}
//           </div>
//         </TooltipTrigger>
//         <TooltipContent>
//           {unit === 'шт' 
//             ? `Масса единицы: ${weightPerUnit} кг` 
//             : `Общая масса: ${totalWeight} кг`}
//         </TooltipContent>
//       </Tooltip>
//     );
//   },
// },
//   {
//   accessorKey: "quantity",
//   header: ({ column }) => {
//     return (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Количество
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     )
//   },
//   cell: ({ row }) => {
//     return `${row.original.quantity} ${row.original.unit}`;
//   },
// },
  // {
  //   accessorKey: "unit",
  //   header: "Единицы",
  // },
  // {
  //   accessorKey: "price",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Цена
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  // },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Цена
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    // Убедитесь, что значения являются числами
    accessorFn: (row) => Number(row.price), // преобразуем в число, если нужно
    cell: (info) => {
      // Форматирование вывода (например, добавление валюты)
      return `${info.getValue()} руб.`;
    }
  },
  {
    id: "pricePerUnit",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Цена за ед.

          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorFn: (row) => {
      const quantity = Number(row.quantity);
      const price = Number(row.price);
      return quantity !== 0 ? price / quantity : 0;
    },
    cell: (info) => {
      const value = info.getValue() as number;
      return `${value.toFixed(2)} руб./${info.row.original.unit}`;
    },
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.original.quantity !== 0 ? rowA.original.price / rowA.original.quantity : 0;
      const valueB = rowB.original.quantity !== 0 ? rowB.original.price / rowB.original.quantity : 0;
      return valueA - valueB;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <Link href={`/product/${row.original.id}`}>
              <DropdownMenuItem>История</DropdownMenuItem>
            </Link>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>Удалить</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
