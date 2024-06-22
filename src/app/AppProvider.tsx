"use client";
import { ClientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      ClientSessionToken.value = initialSessionToken;
    }
  });

  return <>{children}</>;
}
