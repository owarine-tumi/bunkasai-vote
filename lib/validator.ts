export type UserType = "student" | "teacher" | "parent";

export function getUserType(id: string): UserType {
  const value = id.trim().toUpperCase();

  if (value.startsWith("K")) return "teacher";
  if (value.startsWith("P")) return "parent";

  return "student";
}

export function getMaxPoints(type: UserType) {
  return type === "teacher" ? 10 : 5;
}