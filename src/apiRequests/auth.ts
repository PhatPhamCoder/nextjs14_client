import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "./../components/schemaValidations/auth.schema";
import { MessageResType } from "@/components/schemaValidations/common.schema";
const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>(`/auth/login`, body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>(`/auth/register`, body),
  auth: (body: { sessionToken: string; expiresAt: string }) =>
    http.post(`/api/auth`, body, {
      baseUrl: ``,
    }),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(`/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined,
  ) =>
    http.post<MessageResType>(
      `/api/auth/logout`,
      { force },
      {
        baseUrl: "",
        // Hủy gọi API 2 lần
        signal,
      },
    ),

  slideSessioTokenFromNextServerToServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      `/auth/slide-session`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    ),

  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      `/api/auth/slide-session`,
      {},
      {
        baseUrl: "",
      },
    ),
};

export default authApiRequest;
