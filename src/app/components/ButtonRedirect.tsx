"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const ButtonRedirect = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/login`);
  };

  return <Button onClick={handleClick}>ButtonRedirect</Button>;
};

export default ButtonRedirect;
