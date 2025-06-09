import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import { getProducts, deleteProduct } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import AddProductForm from './AddProductForm';

export default async function Warehouse() {
  const products = await getProducts();

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <AddProductForm />
      </div>

      <DataTable columns={columns} data={products} />

    </div>
  )
}