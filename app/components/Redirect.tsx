"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RedirectIfAuthenticated() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.data?.user) {
      router.push("/dashboard");
    }
  }, [session]);

  return null; 
}