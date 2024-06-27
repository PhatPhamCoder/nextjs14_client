import authApiRequest from "@/apiRequests/auth";
import { HttpsError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken) {
    return Response.json(
      { nessage: "Không nhận được sessionToken" },
      {
        status: 401,
      },
    );
  }

  try {
    const res = await authApiRequest.slideSessioTokenFromNextServerToServer(
      sessionToken.value,
    );
    const newExpiresAt = new Date(res?.payload?.data?.expiresAt).toUTCString();
    return Response.json(res.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken.value}; Path=/; HttpOnly=true; Expires=${newExpiresAt}; SameSite=Lax; Secure`,
      },
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Lỗi không xác định",
        },
        {
          status: 500,
        },
      );
    }
  }
}
