import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.user.updateMany({
    data: { hasVoted: false },
  });

  return Response.json({ message: "リセット完了" });
}