"use client";

import { signup } from "@/app/actions/auth-actions";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const initSignInfo = {
  email: "",
  password: "",
  passwordConfirm: "",
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
    placeHolder: "8자 이상 입력해주세요",
    type: "password",
  },
  passwordConfirm: {
    label: "비밀번호 확인",
    placeHolder: "비밀번호를 다시 입력해주세요",
    type: "password",
  },
};

export default function SignUpPage() {
  const [signInfo, setSignInfo] = useState(initSignInfo);
  const [error, setError] = useState<string>("");

  const handleSignInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInfo((prev) => ({ ...prev, [name as SignInfoKeys]: value }));
    setError(""); // 입력 시 에러 메시지 클리어
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const { email, password, passwordConfirm } = signInfo;

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    const result = await signup({ email, password });

    if (result?.status === "ok") {
      redirect("/signin");
    }

    if (result?.message) {
      setError(result.message);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">인프런과 함께 성장하세요</h1>
          <p className="text-gray-600 mt-2">무료 계정을 만들어 다양한 학습 기회를 누려보세요</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
            <CardDescription className="text-center text-gray-600">
              몇 가지 정보만 입력하면 바로 시작할 수 있어요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {signInfoKeys.map((key) => {
                const field = fieldConfig[key];
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium text-gray-700">
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

              {/* 약관 동의 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    회원가입 시 인프런의{" "}
                    <Link href="/terms" className="text-green-600 hover:underline">
                      이용약관
                    </Link>{" "}
                    및{" "}
                    <Link href="/privacy" className="text-green-600 hover:underline">
                      개인정보처리방침
                    </Link>
                    에 동의하는 것으로 간주됩니다.
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                회원가입
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/signin" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
