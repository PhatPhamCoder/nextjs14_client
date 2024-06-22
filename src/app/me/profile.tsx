"use client";
import accountApiRequest from "@/apiRequests/account";
import { ClientSessionToken } from "@/lib/http";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchResquest = async () => {
      const result = await accountApiRequest.me(ClientSessionToken.value);

      console.log(result);
    };

    fetchResquest();
  }, []);

  return <div>Profile</div>;
}
