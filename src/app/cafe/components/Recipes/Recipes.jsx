import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipesCarousel from "./RecipesCarousel";

export default async function Recipes() {
  return (
    <Tabs defaultValue="first" className="items-center">
      <TabsList>
        <TabsTrigger value="first">Первые блюда</TabsTrigger>
        <TabsTrigger value="second">Вторые</TabsTrigger>
        <TabsTrigger value="desserts">Дессерты</TabsTrigger>
      </TabsList>
      <TabsContent value="first">
        <RecipesCarousel type="first" />
      </TabsContent>
      <TabsContent value="second">
        <RecipesCarousel type="second" />
      </TabsContent>
      <TabsContent value="desserts">
        <RecipesCarousel type="desserts" />
      </TabsContent>
    </Tabs>
  );
}
