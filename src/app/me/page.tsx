import envConfig from "@/config";
import { cookies } from "next/headers";
export default async function MePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(`sessionToken`);
  const resopnse = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  ).then(async (res) => {
    const payload = await res.json();

    const data = {
      status: res.status,
      payload: payload,
    };

    if (!res.ok) {
      throw data;
    }

    return data;
  });

  const { data } = resopnse?.payload;

  return (
    <div>
      <ul>
        <li>Tên: {data?.name}</li>
        <li>Email: {data?.email}</li>
      </ul>
    </div>
  );
}
