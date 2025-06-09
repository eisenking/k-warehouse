"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})


export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignIn = async (values) => {
    try {
      setIsPending(true);
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onRequest: () => {
            setIsPending(true);
          },
          onSuccess: async () => {
            router.push("/main");
          },
          onError: (ctx) => {
            toast("Ошибка авторизации", {
              description: "Ошибка авторизации",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
          })
          },
        },
      );
    } catch (error) {
      toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в Личный Кабинет</CardTitle>
          <CardDescription>Введите ваш email и пароль для входа в аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSignIn)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <Input id="password" type="password" {...form.register("password")} required />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Вход..." : "Войти"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Нет аккаунта?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


// "use client";
// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Eye, EyeOff } from "lucide-react";

// const signUpSchema = z
//   .object({
//     name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(50, "Имя не должно превышать 50 символов"),
//     email: z.string().email("Введите корректный email"),
//     password: z
//       .string()
//       .min(5, "Пароль должен содержать минимум 5 символов"),
//     confirmPassword: z.string(),
//     terms: z.boolean().refine((val) => val === true, "Вы должны принять условия использования"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Пароли должны совпадать",
//     path: ["confirmPassword"],
//   });

// export function LoginForm() {
//   const [pending, setPending] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       terms: false,
//     },
//   });

//   const onSubmit = async (values) => {
//     const { name, email, password } = values;

//     try {
//       setPending(true);

//       await authClient.signUp.email(
//         {
//           name,
//           email,
//           password,
//         },
//         {
//           onSuccess: () => {
//             router.push("/");
//           },
//           onError: (error) => {
//             console.error("Ошибка регистрации", error)
//           },
//         },
//       )
//     } catch (error) {
//       console.error("Ошибка:", error)
//     } finally {
//       setPending(false);
//     }
//   }

//   const handlePasswordChange = (e) => {
//     form.setValue("password", e.target.value);
//   }

//   return (
//     <div className="px-8 flex items-center justify-center min-h-screen bg-[#F1EEEE]">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
//           <CardDescription className="text-center">Создайте новый аккаунт</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Имя</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Введите ваше имя" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Электронная почта</FormLabel>
//                     <FormControl>
//                       <Input type="email" placeholder="Введите ваш email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Пароль</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Введите пароль"
//                           {...field}
//                           onChange={handlePasswordChange}
//                         />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                           onClick={() => setShowPassword(!showPassword)}
//                           aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
//                         >
//                           {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                         </Button>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Подтвердите пароль</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Подтвердите пароль" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="terms"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
//                     <FormControl>
//                       <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                     </FormControl>
//                     <div className="space-y-1 leading-none text-sm">
//                       <FormLabel>Я принимаю  <Link href="/user-policy" className="underline">условия использования и политику конфиденциальности.</Link></FormLabel>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={pending}>
//                 {pending ? "Загрузка..." : "Зарегистрироваться"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter>
//           <p className="text-sm text-gray-600 text-center w-full">
//             Уже регистрировались?{" "}
//             <Button variant="link" className="p-0 h-auto font-normal underline underline-offset-4" onClick={() => router.push("/login")}>
//               Войти
//             </Button>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

