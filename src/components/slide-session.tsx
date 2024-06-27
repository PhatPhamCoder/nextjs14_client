"use client";

import authApiRequest from "@/apiRequests/auth";
import { ClientSessionToken } from "@/lib/http";
import { useEffect } from "react";
import { differenceInHours } from "date-fns";
export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const expiresAt = new Date(ClientSessionToken.expiresAt);
      if (differenceInHours(expiresAt, now) < 1) {
        slideSession();
      }
    }, 1000 * 60 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const slideSession = async () => {
    const res = await authApiRequest.slideSessionFromNextClientToNextServer();

    ClientSessionToken.expiresAt = res?.payload?.data?.expiresAt;
  };
  return null;
}
