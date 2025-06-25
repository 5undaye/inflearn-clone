import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <p className="text-3xl">{session?.user?.email}</p>
    </div>
  );
}
