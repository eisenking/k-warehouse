"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function DatePickerWithRange({ date, setDate }: DatePickerProps) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
// }
// "use client"
// import { format } from "date-fns"
// import { ru } from "date-fns/locale"
// import { CalendarIcon } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useState, useEffect } from "react"
// import { getTasksSummaryForMonth } from "@/actions/tasks"

// interface DatePickerProps {
//   date: Date
//   setDate: (date: Date) => void
// }

// export function DatePickerWithRange({ date, setDate }: DatePickerProps) {
//   const [open, setOpen] = useState(false)
//   const [tasksSummary, setTasksSummary] = useState<Record<string, TaskSummary>>({})

//   // Fetch tasks summary when month changes
//   useEffect(() => {
//     const fetchTasksSummary = async () => {
//       try {
//         const year = date.getFullYear()
//         const month = date.getMonth()
//         const summary = await getTasksSummaryForMonth(year, month)
//         setTasksSummary(summary)
//       } catch (error) {
//         console.error("Failed to fetch tasks summary:", error)
//       }
//     }

//     fetchTasksSummary()
//   }, [date.getFullYear(), date.getMonth()])

//   const handleDateSelect = (newDate: Date | undefined) => {
//     if (newDate) {
//       setDate(newDate)
//       setOpen(false) // Auto-close after selection
//     }
//   }

//   const renderDay = (day: Date) => {
//     const dateKey = format(day, "yyyy-MM-dd")
//     const summary = tasksSummary[dateKey]

//     if (!summary || summary.total === 0) {
//       return <span>{day.getDate()}</span>
//     }

//     // Determine badge color based on task status
//     let badgeColor = "bg-gray-400" // default
//     const badgeText = summary.total.toString()

//     const today = new Date()
//     const isOverdue = day < today && summary.pending > 0

//     if (summary.completed === summary.total) {
//       // All tasks completed
//       badgeColor = "bg-green-500"
//     } else if (summary.inProgress > 0) {
//       // Has tasks in progress
//       badgeColor = "bg-yellow-500"
//     } else if (isOverdue) {
//       // Has overdue tasks
//       badgeColor = "bg-red-500"
//     } else if (summary.pending > 0) {
//       // Has pending tasks (not overdue)
//       badgeColor = "bg-blue-500"
//     }

//     return (
//       <div className="relative flex items-center justify-center w-full h-full">
//         <span>{day.getDate()}</span>
//         <div
//           className={cn(
//             "absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
//             badgeColor,
//           )}
//         >
//           {badgeText}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="grid gap-2">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? format(date, "PPP", { locale: ru }) : <span>Выберите дату</span>}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleDateSelect}
//             initialFocus
//             locale={ru}
//             components={{
//               Day: ({ date: dayDate, ...props }) => {
//                 // Filter out React-specific props that shouldn't go to DOM
//                 const { displayMonth, activeModifiers, modifiers, ...domProps } = props as any

//                 return (
//                   <div
//                     {...domProps}
//                     className="relative p-0 h-9 w-9 text-center text-sm flex items-center justify-center"
//                   >
//                     {renderDay(dayDate)}
//                   </div>
//                 )
//               },
//             }}
//             modifiers={{
//               today: new Date(),
//             }}
//             modifiersStyles={{
//               today: { fontWeight: "bold" },
//             }}
//           />
//           <div className="p-3 border-t">
//             <div className="text-xs text-muted-foreground space-y-1">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <span>Все задачи выполнены</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                 <span>Задачи в процессе</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                 <span>Просроченные задачи</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                 <span>Запланированные задачи</span>
//               </div>
//             </div>
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

// "use client"
// import { format } from "date-fns"
// import { ru } from "date-fns/locale"
// import { CalendarIcon } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useState, useEffect } from "react"
// import { getTasksSummaryForMonth } from "@/actions/tasks"


// interface DatePickerProps {
//   date: Date
//   setDate: (date: Date) => void
// }

// export function DatePickerWithRange({ date, setDate }: DatePickerProps) {
//   const [open, setOpen] = useState(false)
//   const [tasksSummary, setTasksSummary] = useState<Record<string, TaskSummary>>({})
//   const [loading, setLoading] = useState(false)

//   // Fetch tasks summary when month changes
//   useEffect(() => {
//     const fetchTasksSummary = async () => {
//       setLoading(true)
//       try {
//         const year = date.getFullYear()
//         const month = date.getMonth()
//         console.log("Fetching tasks summary for:", year, month)
//         const summary = await getTasksSummaryForMonth(year, month)
//         console.log("Received summary:", summary)
//         setTasksSummary(summary)
//       } catch (error) {
//         console.error("Failed to fetch tasks summary:", error)
//         setTasksSummary({})
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTasksSummary()
//   }, [date.getFullYear(), date.getMonth()])

//   const handleDateSelect = (newDate: Date | undefined) => {
//     if (newDate) {
//       console.log("Date selected:", newDate)
//       setDate(newDate)
//       setOpen(false) // Auto-close after selection
//     }
//   }

//   const getBadgeInfo = (day: Date) => {
//     const dateKey = format(day, "yyyy-MM-dd")
//     const summary = tasksSummary[dateKey]

//     if (!summary || summary.total === 0) {
//       return null
//     }

//     // Determine badge color based on task status
//     let badgeColor = "bg-gray-400" // default
//     const badgeText = summary.total.toString()

//     const today = new Date()
//     today.setHours(0, 0, 0, 0) // Reset time for accurate comparison
//     const dayDate = new Date(day)
//     dayDate.setHours(0, 0, 0, 0)

//     const isOverdue = dayDate < today && summary.pending > 0

//     if (summary.completed === summary.total) {
//       // All tasks completed
//       badgeColor = "bg-green-500"
//     } else if (summary.inProgress > 0) {
//       // Has tasks in progress
//       badgeColor = "bg-yellow-500"
//     } else if (isOverdue) {
//       // Has overdue tasks
//       badgeColor = "bg-red-500"
//     } else if (summary.pending > 0) {
//       // Has pending tasks (not overdue)
//       badgeColor = "bg-blue-500"
//     }

//     return { badgeColor, badgeText }
//   }

//   return (
//     <div className="grid gap-2">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? format(date, "PPP", { locale: ru }) : <span>Выберите дату</span>}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleDateSelect}
//             initialFocus
//             locale={ru}
//             formatters={{
//               formatDay: (day) => {
//                 const badgeInfo = getBadgeInfo(day)

//                 if (!badgeInfo) {
//                   return day.getDate().toString()
//                 }

//                 return `${day.getDate()}`
//               },
//             }}
//             components={{
//               DayContent: ({ date: dayDate }) => {
//                 const badgeInfo = getBadgeInfo(dayDate)

//                 return (
//                   <div className="relative w-full h-full flex items-center justify-center">
//                     <span>{dayDate.getDate()}</span>
//                     {badgeInfo && (
//                       <div
//                         className={cn(
//                           "absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
//                           badgeInfo.badgeColor,
//                         )}
//                       >
//                         {badgeInfo.badgeText}
//                       </div>
//                     )}
//                   </div>
//                 )
//               },
//             }}
//             modifiers={{
//               today: new Date(),
//             }}
//             modifiersStyles={{
//               today: { fontWeight: "bold" },
//             }}
//           />
//           <div className="p-3 border-t">
//             <div className="text-xs text-muted-foreground space-y-1">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <span>Все задачи выполнены</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                 <span>Задачи в процессе</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                 <span>Просроченные задачи</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                 <span>Запланированные задачи</span>
//               </div>
//             </div>
//             {loading && <div className="text-xs text-muted-foreground mt-2">Загрузка задач...</div>}
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }
