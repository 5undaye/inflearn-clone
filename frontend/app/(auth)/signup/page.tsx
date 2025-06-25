"use client";

import { signup } from "@/app/actions/auth-actions";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Fragment, useState } from "react";

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
    placeHolder: "********",
    type: "password",
  },
  passwordConfirm: {
    label: "비밀번호 확인",
    placeHolder: "********",
    type: "password",
  },
};

export default function SignUpPage() {
  const [signInfo, setSignInfo] = useState(initSignInfo);

  const handleSignInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignInfo((prev) => ({ ...prev, [name as SignInfoKeys]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, passwordConfirm } = signInfo;

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await signup({ email, password });

    if (result?.status === "ok") {
      redirect("/signin");
    }

    if (result?.message) {
      alert(result.message);
    }
  };

  const signInfoKeys = Object.keys(initSignInfo) as SignInfoKeys[];

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">회원가입</h1>
      <p className="text-gray-700">인프런에서 다양한 학습의 기회를 얻으세요</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 min-w-[300px]">
        {signInfoKeys.map((key) => {
          const field = fieldConfig[key];

          return (
            <Fragment key={key}>
              <label htmlFor={key}>{field.label}</label>
              <input
                type={field.type}
                name={key}
                placeholder={field.placeHolder}
                value={signInfo[key]}
                onChange={handleSignInfoChange}
                className="border-2 border-gray-300 rounded-sm p-2"
              />
            </Fragment>
          );
        })}
        <button type="submit" className="bg-green-500 text-white font-bold cursor-pointer rounded-sm p-2">
          회원가입
        </button>
        <Link href="/signin" className="text-center">
          로그인
        </Link>
      </form>
    </div>
  );
}
