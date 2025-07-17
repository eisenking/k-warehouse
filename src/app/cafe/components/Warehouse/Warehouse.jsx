import { getProducts } from '@/actions/products';
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Warehouse() {
  const products = await getProducts();
  return (
    <DataTable data={products} columns={columns} />
  )
}