import authApiRequest from "@/apiRequests/auth";
import { HttpsError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;

  if (force) {
    return Response.json(
      {
        message: "Vui lòng đăng nhập lại",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      },
    );
  }

  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken) {
    return Response.json(
      {
        message: "Không nhận được session token",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken?.value,
    );

    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
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
