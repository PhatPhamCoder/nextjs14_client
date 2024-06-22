import { LoginResType } from "@/components/schemaValidations/auth.schema";
import envConfig from "@/config";

type CustomeOption = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

class HttpsError extends Error {
  status: number;
  payload: any;
  constructor({ status, payload }: { status: number; payload: any }) {
    super(`Http Error`);
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
    throw new HttpsError(data);
  }

  if (["/auth/login", "/auth/register"].includes(url)) {
    ClientSessionToken.value = (payload as LoginResType).data.token;
  } else if (`/auth/logout`.includes(url)) {
    ClientSessionToken.value = "";
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
