import { auth } from "@/auth";
import * as api from "@/lib/api";
import UI from "./ui";
import { getInstructorReviews } from "@/lib/api";

export default async function InstructorReviewsPage() {
  const session = await auth();
  const { data: reviews, error } = await api.getInstructorReviews();

  if (!session?.user) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (error) {
    return <div>리뷰를 가져오는 중에 에러가 발생했습니다.</div>;
  }

  return <UI user={session.user} reviews={reviews ?? []} />;
}
