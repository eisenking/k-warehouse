import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Warehouse from "@/app/main/components/Warehouse/Warehouse";
import Recipes from "@/app/main/components/Recipes/Recipes";
import Tasks from "@/app/main/components/Tasks/Tasks";
import Production from "@/app/main/components/Production/Production";
import Sales from "@/app/main/components/Sales/Sales";

export default async function Main() {
  return (
    <section className="w-full max-w-7xl">
      <Tabs defaultValue="warehouse" className="items-center">
        <TabsList className='flex items-center justify-start flex-wrap h-auto space-y-1'>
          <TabsTrigger value="warehouse">СкладK</TabsTrigger>
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