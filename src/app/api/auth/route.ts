export async function POST(request: Request) {
  const res = await request.json();

  const sessionToken = res.sessionToken as string;

  const expiresAt = res.expiresAt as number;

  if (!sessionToken) {
    return Response.json(
      { nessage: "Không nhận được sessionToken" },
      {
        status: 400,
      },
    );
  }

  const expiredAt = new Date(expiresAt).toUTCString();
  return Response.json(res?.sessionToken, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly=true; Expires=${expiredAt}; SameSite=Lax; Secure`,
    },
  });
}
