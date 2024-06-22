import { AccountResType } from "@/components/schemaValidations/account.schema";
import http from "@/lib/http";

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>(`account/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default accountApiRequest;
