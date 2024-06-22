import { LoginResType } from "@/components/schemaValidations/auth.schema";
import envConfig from "@/config";
import { normalLizePath } from "@/lib/utils";
import { redirect } from "next/navigation";

type CustomeOption = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpsError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super(`Http Error`);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpsError {
  status: 422;
  payload: EntityErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    if (status !== ENTITY_ERROR_STATUS) {
      throw new Error("EntityError must have status 422");
    }
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";
  get value() {
    return this.token;
  }

  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }

    this.token = token;
  }
}

export const ClientSessionToken = new SessionToken();

let clientLogoutRequest: null | Promise<any> = null;

const requrest = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomeOption | undefined,
) => {
  const body = options ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: ClientSessionToken.value
      ? `Bearer ${ClientSessionToken.value}`
      : "",
  };

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options?.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        },
      );
    } else if (res.status === AUTHENTICATION_STATUS) {
      if (!clientLogoutRequest) {
        if (typeof window !== "undefined") {
          // Nếu ở dưới client | Xử lí logout dưới client
          clientLogoutRequest = fetch(`/api/auth/logout`, {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            },
          });
          await clientLogoutRequest;
          ClientSessionToken.value = "";
          location.href = "/login";
        } else {
          // Xử lí logout trên server
          const sessionToken = (options?.headers as any).Authorization.split(
            "Bearer ",
          )[1];
          redirect(`/logout?sessionToken=${sessionToken}`);
        }
      }
    } else {
      throw new HttpsError(data);
    }
  }

  if (typeof window !== "undefined") {
    if (
      // Chuẩn hóa đường dẫn "/"
      ["/auth/login", "/auth/register"].some(
        (item) => item === normalLizePath(url),
      )
    ) {
      ClientSessionToken.value = (payload as LoginResType).data.token;
    } else if (`/auth/logout` === normalLizePath(url)) {
      ClientSessionToken.value = "";
    }
  }

  return data;
};
type CustomeOptionWithoutBody = Omit<CustomeOption, "body">;
const http = {
  get<Response>(url: string, options?: CustomeOptionWithoutBody) {
    return requrest<Response>("GET", url, options);
  },
  post<Response>(url: string, body: any, options?: CustomeOptionWithoutBody) {
    return requrest<Response>("POST", url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: CustomeOptionWithoutBody) {
    return requrest<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(url: string, body: any, options?: CustomeOptionWithoutBody) {
    return requrest<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
