import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Warehouse from "@/app/main/components/Warehouse/Warehouse";
import Recipes from "@/app/main/components/Recipes/Recipes";
import Tasks from "@/app/main/components/Tasks/Tasks";
import Production from "@/app/main/components/Production/Production";
import Sales from "@/app/main/components/Sales/Sales";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "./components/SignOutButton";

export default async function Main() {
   
  const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
  })
  const user = session?.user;
  const role = user?.role; 

  return (
    <section className="w-full max-w-7xl">
      <div className="mb-4 flex justify-center items-baseline gap-3">
        <h2>Здравствуйте, {user?.name}! ваша роль - {role}</h2>
        <SignOutButton />
      </div>
      <Tabs defaultValue="warehouse" className="items-center">
        <TabsList>
          <TabsTrigger value="warehouse">Склад</TabsTrigger>
          <TabsTrigger value="recipes">ТехКарты</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger> 
          <TabsTrigger value="production">Производство</TabsTrigger>          
          <TabsTrigger value="sales">Продажи</TabsTrigger>
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