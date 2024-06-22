export async function POST(req: Request) {
  const res = await req.json();
  const sessionToken = res?.payload?.data?.token;

  if (!sessionToken) {
    return Response.json(
      { nessage: "Không nhận được sessionToken" },
      {
        status: 400,
      },
    );
  }
  return Response.json(res?.payload, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly=true`,
    },
  });
}
