export async function POST(request: Request) {
  const res = await request.json();

  const sessionToken = res.sessionToken as string;
  if (!sessionToken) {
    return Response.json(
      { nessage: "Không nhận được sessionToken" },
      {
        status: 400,
      },
    );
  }
  return Response.json(res?.sessionToken, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly=true`,
    },
  });
}


