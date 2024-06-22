"use client";
import authApiRequest from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const result = await authApiRequest.logoutFromNextClientToNextServer();

      toast({
        title: result.payload.message,
      });
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
