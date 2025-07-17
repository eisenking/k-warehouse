import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProductHistory } from "@/actions/productHistory";
import { format } from "date-fns";

export default async function ProductHistoryPage({ params }) {
  const product_id = params.product_id;
  console.log('lololo', product_id)
  const history = await getProductHistory(product_id);

  const averagePrice = history.reduce((acc, h) => {
    const price = parseFloat(h.newPrice || 0);
    const qty = h.newQuantity || 0;
    acc.totalQty += qty;
    acc.totalSum += price * qty;
    return acc;
  }, { totalQty: 0, totalSum: 0 });

  const avgPrice = averagePrice.totalQty > 0
    ? (averagePrice.totalSum / averagePrice.totalQty).toFixed(2)
    : "0.00";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">История товара</h1>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Средняя цена за ед.</div>
          <div className="text-3xl font-semibold">{avgPrice} ₽</div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">График цен</TabsTrigger>
          <TabsTrigger value="history">История изменений</TabsTrigger>
          <TabsTrigger value="usage">Использование в производстве</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardContent className="h-[300px] p-4">
              {/* <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history.map(h => ({
                  date: format(new Date(h.createdAt), 'dd.MM.yy'),
                  price: parseFloat(h.newPrice || 0)
                }))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <ScrollArea className="h-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Дата</th>
                  <th className="p-2">Тип</th>
                  <th className="p-2">Пользователь</th>
                  <th className="p-2">Кол-во</th>
                  <th className="p-2">Цена</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="border-b">
                    <td className="p-2">{format(new Date(h.createdAt), 'dd.MM.yyyy')}</td>
                    <td className="p-2">{h.changeType}</td>
                    <td className="p-2">{h.userId.slice(0, 6)}...</td>
                    <td className="p-2">{h.oldQuantity} → {h.newQuantity}</td>
                    <td className="p-2">{h.oldPrice} → {h.newPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="usage">
          <ScrollArea className="h-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Дата</th>
                  <th className="p-2">Продукция</th>
                  <th className="p-2">Кол-во</th>
                </tr>
              </thead>
              <tbody>
                {/* {usage.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{format(new Date(u.createdAt), 'dd.MM.yyyy')}</td>
                    <td className="p-2">{u.recipeName}</td>
                    <td className="p-2">{u.quantity}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
