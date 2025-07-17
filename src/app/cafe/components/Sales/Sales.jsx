import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesCarousel from "./SalesCarousel";

export default async function Sales() {
  return (
    <Tabs defaultValue="first" className="items-center">
      <TabsList>
        <TabsTrigger value="first">Первые блюда</TabsTrigger>
        <TabsTrigger value="second">Вторые</TabsTrigger>
        <TabsTrigger value="desserts">Дессерты</TabsTrigger>
      </TabsList>
      <TabsContent value="first">
        <SalesCarousel type="first" />
      </TabsContent>
      <TabsContent value="second">
        <SalesCarousel type="second" />
      </TabsContent>
      <TabsContent value="desserts">
        <SalesCarousel type="desserts" />
      </TabsContent>
    </Tabs>
  );
}
