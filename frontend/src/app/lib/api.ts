import { getSession } from "next-auth/react";
import { API_URL } from "../settings/settings";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const envBaseURL =
  (typeof API_URL === "string" && API_URL
    ? API_URL
    : process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8000/";

/**
 * Avoid mixed content: when the app is served over HTTPS, always use HTTPS for the API.
 * NEXT_PUBLIC_* is baked in at build time—if the image was built with http://, we fix it at runtime here.
 */
function getBaseURL(): string {
  let base = envBaseURL.endsWith("/") ? envBaseURL.slice(0, -1) : envBaseURL;
  const isBrowser = typeof window !== "undefined";
  const pageIsHttps = isBrowser && window.location.protocol === "https:";
  const baseIsHttp = base.startsWith("http://");
  const isLocalhost = base.includes("localhost");
  if (pageIsHttps && baseIsHttp && !isLocalhost) {
    base = "https://" + base.slice(7);
  }
  return base;
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const base = getBaseURL();
  const urlPath = path.startsWith("/") ? path : `/${path}`;
  let url = `${base}${urlPath}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  return url;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const session: any = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config.headers || {}),
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(buildUrl(path, config.params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  let data: unknown = null;
  if (response.status !== 204) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = (await response.text()) as unknown;
    }
  }

  if (!response.ok) {
    const error: any = new Error("API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return {
    data: data as T,
    status: response.status,
  };
}

const api = {
  get<T = unknown>(path: string, config?: RequestConfig) {
    return request<T>("GET", path, undefined, config);
  },
  post<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("POST", path, body, config);
  },
  put<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("PUT", path, body, config);
  },
  patch<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("PATCH", path, body, config);
  },
  delete<T = unknown>(path: string, config?: RequestConfig) {
    return request<T>("DELETE", path, undefined, config);
  },
};

export default api;
