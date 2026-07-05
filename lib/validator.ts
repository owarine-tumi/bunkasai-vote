export type UserType = "student" | "teacher" | "parent";

export function getUserType(id: string): UserType {
  if (id.startsWith("K")) return "teacher";
  if (id.startsWith("P")) return "parent";
  return "student";
}

export function getMaxPoints(type: UserType) {
  return type === "teacher" ? 10 : 5;
}

export function countSelected(points: Record<string, number>) {
  return Object.values(points).filter((p) => p > 0).length;
}

export function totalPoints(points: Record<string, number>) {
  return Object.values(points).reduce((a, b) => a + b, 0);
}