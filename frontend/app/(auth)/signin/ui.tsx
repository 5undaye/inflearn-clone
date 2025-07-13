"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const initSignInfo = {
  email: "",
  password: "",
};

type SignInfoKeys = keyof typeof initSignInfo;
type InputFields = { label: string; placeHolder: string; type: string };

const fieldConfig: Record<SignInfoKeys, InputFields> = {
  email: {
    label: "이메일",
    placeHolder: "example@inflab.com",
    type: "email",
  },
  password: {
    label: "비밀번호",
    placeHolder: "********",
    type: "password",
  },
};

export default function UI() {
  const [signInfo, setSignInfo] = useState(initSignInfo);

  const handleSignInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInfo((prev) => ({ ...prev, [name as SignInfoKeys]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      ...signInfo,
      redirectTo: "/",
    });
  };

  const signInfoKeys = Object.keys(initSignInfo) as SignInfoKeys[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">인</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            인프런에 오신 것을 환영합니다
          </h1>
          <p className="text-gray-600 mt-2">
            라이프타임 커리어 플랫폼에서 새로운 학습을 시작하세요
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              인프런 계정으로 로그인하여 다양한 강의를 만나보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {signInfoKeys.map((key) => {
                const field = fieldConfig[key];
                return (
                  <div key={key} className="space-y-2">
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={key}
                      type={field.type}
                      name={key}
                      placeholder={field.placeHolder}
                      value={signInfo[key]}
                      onChange={handleSignInfoChange}
                      className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                );
              })}

              <Button
                type="submit"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                로그인
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
