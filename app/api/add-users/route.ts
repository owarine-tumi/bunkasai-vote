import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { studentIds } = await req.json();

  if (!studentIds || !Array.isArray(studentIds)) {
    return Response.json({ error: "配列が必要" }, { status: 400 });
  }

  for (const id of studentIds) {
    await prisma.user.upsert({
      where: { studentId: id },
      update: {},
      create: {
        studentId: id,
        hasVoted: false,
      },
    });
  }

  return Response.json({ message: "OK" });
}