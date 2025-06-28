"use server";

import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

type HTTPHeaders = {
  "Content-Type"?: string;
  Authorization?: string;
};

type APIProps = {
  endPoint: string;
  options: RequestInit;
  token?: string;
};

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";

const API_URL = process.env.API_URL || "http://localhost:8000";

async function fetchAPI<T>({ endPoint, options, token }: APIProps) {
  const headers: HTTPHeaders = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    cache: "no-cache",
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endPoint}`, config);

  if (!response.ok) {
    throw new Error(`API 요청 실패:${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("Content-Type");

  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
}

export async function getUserTest(token?: string) {
  if (!token && typeof window == "undefined") {
    token = await getCookie(AUTH_COOKIE_NAME, { cookies });
  }

  return fetchAPI({ endPoint: "/user-test", options: {}, token });
}
