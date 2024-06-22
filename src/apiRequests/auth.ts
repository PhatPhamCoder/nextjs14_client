import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "./../components/schemaValidations/auth.schema";
import { MessageResType } from "@/components/schemaValidations/common.schema";
const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>(`/auth/login`, body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>(`/auth/register`, body),
  auth: (body: { sessionToken: string }) =>
    http.post(`/api/auth`, body, {
      baseUrl: ``,
    }),

  logoutFromNextServerToServer: (sessionToken: string) => http.post<MessageResType>(`/auth/logout`, null, {
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  }),
  logoutFromNextClientToNextServer: () => http.post<MessageResType>(`/api/auth/logout`, null, {
    baseUrl: ``,
  })
};

export default authApiRequest;
