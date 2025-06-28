import * as api from "@/lib/api";
import ClientTest from "./client-test";
import type { ReactNode } from "react";

export default async function ApiTestPage() {
  const apiResult = (await api.getUserTest()) as ReactNode;

  return (
    <div className="p-8">
      <h1>백엔드 API 테스트</h1>
      <h2>서버 컴포넌트 API 테스트 결과</h2>
      <pre>{apiResult}</pre>
      <ClientTest />
    </div>
  );
}
