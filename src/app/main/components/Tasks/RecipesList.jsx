import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card"

export default function Recipes() {
  return (
        <Tabs defaultValue="first" className="items-center">
            <TabsList>
                <TabsTrigger value="first">Первые блюда</TabsTrigger>
                <TabsTrigger value="second">Вторые</TabsTrigger>          
                <TabsTrigger value="desserts">Дессерты</TabsTrigger>
            </TabsList>
            <TabsContent value="first">
                <Carousel opts={{ loop: true }} className="w-full max-w-sm">
                    <CarouselContent className="-ml-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-2xl font-semibold">{index + 1}</span>
                            </CardContent>
                            </Card>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </TabsContent>
            <TabsContent value="second">
            <div>second</div>
            </TabsContent>
            <TabsContent value="desserts">
            <div>desserts</div>
            </TabsContent>
        </Tabs>
    )
}