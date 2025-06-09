"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Clock, Trash2 } from "lucide-react"
import { getTasks } from "@/actions/tasks"

interface TasksListProps {
  date: Date
}

export function TasksList({ date }: TasksListProps) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const tasksData = await getTasks(formattedDate)
        setTasks(tasksData)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [date])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading tasks...</div>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks planned for this date</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Recipe</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Portions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <div className="flex items-center">{getStatusIcon(task.status)}</div>
            </TableCell>
            <TableCell className="font-medium">{task.recipe.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{task.recipe.type}</Badge>
            </TableCell>
            <TableCell className="text-right">{task.portionsPlanned}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
