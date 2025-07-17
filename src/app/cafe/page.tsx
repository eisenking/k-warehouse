import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Warehouse from "@/app/cafe/components/Warehouse/Warehouse";
import Recipes from "@/app/cafe/components/Recipes/Recipes";
import Tasks from "@/app/cafe/components/Tasks/Tasks";
import Production from "@/app/cafe/components/Production/Production";
import Sales from "@/app/cafe/components/Sales/Sales";

export default async function Main() {
  return (
    <section className="w-full max-w-7xl">
      <Tabs defaultValue="warehouse" className="items-center">
        <TabsList className='flex items-center justify-start flex-wrap h-auto space-y-1'>
          <TabsTrigger value="warehouse">Склад</TabsTrigger>
          <TabsTrigger value="recipes">ТехКарты</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger> 
          <TabsTrigger value="production">Производство</TabsTrigger>          
          <TabsTrigger value="sales" className="mb-1">Продажи</TabsTrigger>
        </TabsList>
        <TabsContent value="warehouse">
          <Warehouse />
        </TabsContent>
        <TabsContent value="recipes">
          <Recipes />
        </TabsContent>
        <TabsContent value="tasks">
          <Tasks />
        </TabsContent>
        <TabsContent value="production">
          <Production />
        </TabsContent>
        <TabsContent value="sales">
          <Sales />
        </TabsContent>
      </Tabs>
    </section>
  );
}