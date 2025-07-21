"use client";

import {
  CourseDetailDto,
  Section,
  Lecture,
  CourseReview,
  User,
} from "@/generated/openapi-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
  StarIcon,
  PlayCircleIcon,
  LockIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { getLevelText } from "@/lib/level";

/*****************
 * Helper Utils  *
 *****************/
function formatSecondsToMinSec(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatSecondsToHourMin(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0) return `${mins}분`;
  return `${hrs}시간 ${mins}분`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const mockInstructorStats = {
  students: 1234,
  reviews: 56,
  courses: 3,
  answers: 10,
};

/*****************
 * Sub Components *
 *****************/
function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-4",
            i < rounded
              ? "fill-yellow-400 stroke-yellow-400"
              : "stroke-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

function Header({ course }: { course: CourseDetailDto }) {
  return (
    <header className="relative text-white rounded-md p-8">
      <div className="absolute bg-[#0F1415] top-0 bottom-0 w-screen left-1/2 -translate-x-1/2 -z-10"></div>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Thumbnail - Mobile: top, Desktop: right */}
        {course.thumbnailUrl && (
          <div className="relative w-full md:w-64 flex-shrink-0 md:order-2">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={256}
              height={144}
              className="rounded-md w-full h-auto object-cover"
            />
            {/* Play button overlay */}
            <button
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="preview"
              onClick={() => alert("미리보기 기능 준비중")}
            >
              <PlayCircleIcon className="size-16 text-white/90 drop-shadow-lg group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
        {/* Content - Mobile: bottom, Desktop: left */}
        <div className="flex-1 md:order-1">
          {course.categories?.[0] && (
            <p className="text-sm text-gray-300 mb-1">
              {course.categories[0].name}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
          {course.shortDescription && (
            <p className="text-lg text-gray-300 mb-4">
              {course.shortDescription}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
            <StarRating rating={course.averageRating} />
            <span className="font-medium">{course.averageRating.toFixed(1)}</span>
            <span className="text-gray-300">
              ({course.totalReviews}개 수강평)
            </span>
            <span className="hidden md:inline text-gray-300">·</span>
            <span>수강생 {course.totalEnrollments.toLocaleString()}명</span>
          </div>
          <p className="text-sm text-gray-300">
            by {course.instructor.name}
          </p>
        </div>
      </div>
    </header>
  );
}

function LatestReviews({ reviews }: { reviews: CourseReview[] }) {
  if (!reviews.length) return null;
  const latest = [...reviews]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4);

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">최근 리뷰</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latest.map((r) => (
          <div
            key={r.id}
            className="border rounded-md p-4 flex flex-col gap-2 bg-white"
          >
            <div className="flex items-center gap-2">
              {r.user?.image && (
                <Image
                  src={r.user.image}
                  alt={r.user.name || "user"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <span className="text-sm font-medium">
                  {r.user?.name ?? "익명"}
                </span>
              </div>
              <StarRating rating={r.rating} />
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
              {r.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Introduction({ course }: { course: CourseDetailDto }) {
  return (
    <section id="introduction" className="">
      <h2 className="text-2xl font-bold mb-6">강의 소개</h2>
      <LatestReviews reviews={course.reviews} />
      {course.description && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      )}
    </section>
  );
}

function LectureRow({
  lecture,
  className,
}: {
  lecture: Lecture;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-sm px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {lecture.isPreview ? (
          <PlayCircleIcon className="size-4 text-primary" />
        ) : (
          <LockIcon className="size-4 text-muted-foreground" />
        )}
        <span>{lecture.title}</span>
      </div>
      <div className="flex items-center gap-2">
        {lecture.isPreview && (
          <button
            onClick={() => alert("구현 예정")}
            className="cursor-pointer text-sm px-2 py-1 border border-gray-400 text-gray-800 font-semibold rounded-md"
          >
            미리보기
          </button>
        )}
        <span>{formatSecondsToMinSec(lecture.duration ?? 0)}</span>
      </div>
    </div>
  );
}

function Curriculum({ sections }: { sections: Section[] }) {
  return (
    <section id="curriculum" className="mt-12">
      <h2 className="text-2xl font-bold mb-6">커리큘럼</h2>
      <div className="border rounded-lg overflow-hidden">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <AccordionTrigger className="flex text-base font-medium bg-[#F8F9FA] hover:bg-gray-100 px-4 py-4">
                <span className="flex-1 text-left">{section.title}</span>
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {section.lectures.length}개 수업
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="flex flex-col">
                  {section.lectures
                    .sort((a, b) => a.order - b.order)
                    .map((lecture, idx) => (
                      <LectureRow
                        key={lecture.id}
                        lecture={lecture}
                        className={cn(
                          "bg-white",
                          idx !== section.lectures.length - 1 &&
                            "border-b border-gray-100",
                        )}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }: { reviews: CourseReview[] }) {
  if (!reviews.length) return null;
  return (
    <section id="reviews" className="mt-12">
      <h2 className="text-2xl font-bold mb-6">수강평</h2>
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start gap-3">
              {r.user?.image ? (
                <Image
                  src={r.user.image}
                  alt={r.user.name || "user"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {r.user?.name?.charAt(0) ?? "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-medium">{r.user?.name ?? "익명"}</p>
                  <StarRating rating={r.rating} />
                  <span className="text-sm text-gray-500">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {r.content}
                </p>
                {r.instructorReply && (
                  <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary">
                        지식공유자 답변
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {r.instructorReply}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InstructorBio({ instructor }: { instructor: User }) {
  return (
    <>
      <hr className="border-t border-gray-300 my-12" />
      <section id="instructor" className="">
        <h2 className="text-2xl font-bold mb-6">지식공유자 소개</h2>
        <div className="flex gap-4">
          {instructor.image && (
            <Image
              src={instructor.image}
              alt={instructor.name || "instructor"}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20"
            />
          )}
          <div>
            <h3 className="text-lg font-medium mb-2">{instructor.name}</h3>
            {instructor.bio && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: instructor.bio }}
              />
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
              <span>
                수강생 {mockInstructorStats.students.toLocaleString()}명
              </span>
              <span>수강평 {mockInstructorStats.reviews}개</span>
              <span>답변 {mockInstructorStats.answers}개</span>
              <span>강의 {mockInstructorStats.courses}개</span>
              <span>평점 4.8</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FloatingMenu({ course }: { course: CourseDetailDto }) {
  const handleCart = useCallback(() => {
    alert("장바구니 기능은 준비 중입니다.");
  }, []);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:block hidden">
      <div className="border rounded-lg w-80 overflow-hidden">
        <div className="p-6 space-y-3 bg-white">
          {/* 가격 */}
          <div>
            {course.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  ₩{course.discountPrice.toLocaleString()}
                </span>
                <span className="ml-2 line-through text-gray-400 text-lg">
                  ₩{course.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                ₩{course.price.toLocaleString()}
              </span>
            )}
          </div>
          <button className="w-full py-3 px-4 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
            수강신청 하기
          </button>
          <button
            onClick={handleCart}
            className="w-full py-3 px-4 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            바구니에 담기
          </button>
          <button
            disabled
            className="w-full py-3 px-4 rounded-md border border-gray-200 font-medium text-gray-400 cursor-not-allowed"
          >
            즐겨찾기 (준비중)
          </button>
        </div>
        {/* info section */}
        <div className="bg-[#F8F9FA] p-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">지식공유자</span>
            <span className="font-medium">{course.instructor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">강의 수</span>
            <span className="font-medium">{course.totalLectures}개</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">강의 시간</span>
            <span className="font-medium">
              {formatSecondsToHourMin(course.totalDuration)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">난이도</span>
            <span className="font-medium">{getLevelText(course.level)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileBottomBar({ course }: { course: CourseDetailDto }) {
  const handleCart = () => {
    alert("장바구니 기능은 준비 중입니다.");
  };
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 border-t bg-white flex items-center gap-4 px-4 py-3 z-50 shadow">
      <div className="flex-1">
        {course.discountPrice ? (
          <>
            <span className="font-bold text-lg text-primary">
              {course.discountPrice.toLocaleString()}원
            </span>
            <span className="ml-2 line-through text-muted-foreground text-sm">
              {course.price.toLocaleString()}원
            </span>
          </>
        ) : (
          <span className="font-bold text-lg">
            {course.price.toLocaleString()}원
          </span>
        )}
      </div>
      <button className="flex-1 py-2 rounded-md bg-primary text-white font-semibold">
        수강신청
      </button>
      <button
        onClick={handleCart}
        className="p-2 rounded-md border font-medium"
        aria-label="장바구니에 담기"
      >
        <ShoppingCartIcon className="size-5" />
      </button>
    </div>
  );
}

/*****************
 * Main Component *
 *****************/
export default function CourseDetailUI({
  course,
}: {
  course: CourseDetailDto;
}) {
  return (
    <div className="mx-auto px-4 py-12 pb-24 lg:pb-12">
      <Header course={course} />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10">
        {/* Main content */}
        <div className="max-w-3xl">
          <Introduction course={course} />
          <InstructorBio instructor={course.instructor} />
          <Curriculum sections={course.sections} />
          <ReviewsSection reviews={course.reviews} />
        </div>

        {/* Floating menu */}
        <FloatingMenu course={course} />
      </div>

      {/* 모바일 하단 바 */}
      <MobileBottomBar course={course} />
    </div>
  );
}
