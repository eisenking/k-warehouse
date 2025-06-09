'use client';

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };
  return (
    <Button 
      variant="outline"
      onClick={handleSignOut}
    >
      Выйти
    </Button>
  );
}