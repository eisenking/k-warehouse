import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import { getProducts, deleteProduct } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { TrashIcon, PencilIcon, PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DatePicker } from "@/components/ui/DatePicker";

export default async function Sales() {
  const products = await getProducts();


  return (
    <div>
      <div className="flex">
          <div className="flex items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить продукт</DialogTitle>
                  <DialogDescription>Укажите данные нового продукта</DialogDescription>
                </DialogHeader>


                
              </DialogContent>
            </Dialog>
          </div>
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
                  <DialogTitle>Добавить продукт</DialogTitle>
                  <DialogDescription>Укажите данные нового продукта</DialogDescription>
                </DialogHeader>


                
              </DialogContent>
            </Dialog>
          </div>
      </div>
      <div>
        <DatePicker />
      </div>

      <DataTable columns={columns} data={products} />

    </div>
  )
}