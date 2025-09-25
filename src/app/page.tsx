"use client";
import { useEffect } from "react";
import { useCurrent } from "./api/use.current";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/api/use-logout";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);
  return (
    <div className="flex items-center justify-center h-screen font-bold  flex-col gap-5 mx-auto text-center">
      Only visible to authorized users
      <Button onClick={() => mutate()}>Logout</Button>
      <UserButton />
    </div>
  );
}
