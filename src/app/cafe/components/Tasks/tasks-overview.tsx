"use client"

import { useState } from "react"
import { format } from "date-fns"
import { TasksList } from "./tasks-list"
import { DatePickerWithRange } from "./date-picker"
import { AddTaskButton } from "./add-task-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsNeeded } from "./products-needed"

export function TasksOverview() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <DatePickerWithRange date={date} setDate={setDate} />
        <AddTaskButton />
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="products">Required Products</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {format(date, "MMMM d, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksList date={date} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Required Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductsNeeded date={date} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
