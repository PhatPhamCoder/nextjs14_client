import accountApiRequest from "@/apiRequests/account";
import Profile from "@/app/me/profile";
import { cookies } from "next/headers";
export default async function MePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(`sessionToken`);
  const data = await accountApiRequest.me(sessionToken?.value ?? "");
  return (
    <div>
      <ul>
        Xin chào, {data?.payload?.data?.name}
        {/* <Profile /> */}
      </ul>
    </div>
  );
}
