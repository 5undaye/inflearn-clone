import UI from "./ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "강좌 만들기 - 인프런",
  description: "인프런 강좌 만들기 페이지입니다.",
};

export default function CreateCoursePage() {
  return <UI />;
}
