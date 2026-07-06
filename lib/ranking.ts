export const NSV_POINTS = [36, 32, 24, 20, 16, 12];

export const allClasses = [
  "1年1組","1年2組","1年3組","1年4組","1年5組","1年6組",
  "2年1組","2年2組","2年3組","2年4組","2年5組","2年6組",
  "3年1組","3年2組","3年3組","3年4組","3年5組","3年6組",
];

export function createEmptyScore() {
  const score: Record<string, number> = {};

  allClasses.forEach((c) => {
    score[c] = 0;
  });

  return score;
}

export function sortRanking(score: Record<string, number>) {
  return Object.entries(score)
    .map(([name, point]) => ({
      name,
      point,
    }))
    .sort((a, b) => b.point - a.point);
}

export function filterGrade(
  ranking: any[],
  grade: number
) {
  return ranking.filter((item) =>
    item.name.startsWith(`${grade}年`)
  );
}
export function calculateNSV(ranking: any[]) {
  const result: Record<string, number> = {};

  ranking.forEach((item) => {
    result[item.name] = 0;
  });

  [1, 2, 3].forEach((grade) => {
    const gradeRanking = filterGrade(ranking, grade);

    gradeRanking.forEach((item, index) => {
      result[item.name] = NSV_POINTS[index] ?? 0;
    });
  });

  return result;
}

export function mergeNSV(
  student: Record<string, number>,
  teacher: Record<string, number>,
  parent: Record<string, number>
) {
  const total: Record<string, number> = {};

  allClasses.forEach((c) => {
    total[c] =
      (student[c] || 0) +
      (teacher[c] || 0) +
      (parent[c] || 0);
  });

  return sortRanking(total);
}
type Vote = {
  userType?: "student" | "teacher" | "parent";
  voterType?: "student" | "teacher" | "parent";
  points: Record<string, number>;
};

export function getRanking(votes: Vote[]) {
  const total = createEmptyScore();
  const student = createEmptyScore();
  const teacher = createEmptyScore();
  const parent = createEmptyScore();

  votes.forEach((vote) => {
    const type = vote.userType || vote.voterType;

    Object.entries(vote.points || {}).forEach(([className, point]) => {
      const p = Number(point) || 0;

      total[className] += p;

      if (type === "student") {
        student[className] += p;
      } else if (type === "teacher") {
        teacher[className] += p;
      } else if (type === "parent") {
        parent[className] += p;
      }
    });
  });

  const totalRank = sortRanking(total);
  const studentRank = sortRanking(student);
  const teacherRank = sortRanking(teacher);
  const parentRank = sortRanking(parent);

  const studentNSV = calculateNSV(studentRank);
  const teacherNSV = calculateNSV(teacherRank);
  const parentNSV = calculateNSV(parentRank);

  const nsvRank = mergeNSV(studentNSV, teacherNSV, parentNSV);

  return {
    totalRank,
    studentRank,
    teacherRank,
    parentRank,

    studentNSV,
    teacherNSV,
    parentNSV,
    nsvRank,
  };
}