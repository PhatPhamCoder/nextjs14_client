"use client";

import authApiRequest from "@/apiRequests/auth";
import { ClientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchparam = useSearchParams();
  const sessionToken = searchparam.get("sessionToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (sessionToken === ClientSessionToken?.value) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => {
          router.push(`/login?redirectFrom=${pathname}`);
        });
    }

    return () => {
      controller.abort();
    };
  }, [sessionToken, router, pathname]);
  return <div>LogoutPage</div>;
}
