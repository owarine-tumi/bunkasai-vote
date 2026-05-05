"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const allClasses = [
  "1年1組","1年2組","1年3組","1年4組","1年5組","1年6組",
  "2年1組","2年2組","2年3組","2年4組","2年5組","2年6組",
  "3年1組","3年2組","3年3組","3年4組","3年5組","3年6組",
];

export default function Home() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");

  const grade = studentId[0];

  const classes = allClasses.filter(
    (className) => !className.startsWith(`${grade}年`)
  );

  const [points, setPoints] = useState(
    Object.fromEntries(allClasses.map((name) => [name, 0]))
  );

  const totalUsed = Object.values(points).reduce(
    (sum, value) => sum + value,
    0
  );

  const remaining = 5 - totalUsed;

  const increasePoint = (className: string) => {
    if (remaining <= 0) return;

    setPoints({
      ...points,
      [className]: points[className] + 1,
    });
  };

  const decreasePoint = (className: string) => {
    if (points[className] <= 0) return;

    setPoints({
      ...points,
      [className]: points[className] - 1,
    });
  };

  const handleVote = async () => {
    // 🔥 管理者なら管理画面へ
    if (studentId.trim() === "T1125") {
      router.push("/admin");
      return;
    }

    if (!studentId) {
      alert("学籍番号を入力してください！");
      return;
    }

    if (remaining !== 0) {
      alert("ポイントをすべて使ってください！");
      return;
    }

    try {
      const studentRef = doc(db, "students", studentId);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        alert("この学籍番号は登録されていません");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.voted) {
        alert("すでに投票済みです！");
        return;
      }

      await addDoc(collection(db, "votes"), {
        studentId,
        points,
        createdAt: new Date(),
      });

      await updateDoc(studentRef, {
        voted: true,
      });

      alert("投票が完了しました！");
    } catch (error) {
      alert("エラーが発生しました");
      console.log(error);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        文化祭投票
      </h1>

      <input
        type="text"
        placeholder="学籍番号を入力"
        value={studentId}
        onChange={(e) =>
          setStudentId(e.target.value)
        }
        className="border p-3 rounded w-full mb-6"
      />

      <p className="mb-6 text-lg">
        残りポイント：{remaining}
      </p>

      <div className="space-y-4">
        {classes.map((className) => (
          <div
            key={className}
            className="border p-4 rounded-xl"
          >
            <p className="font-semibold">
              {className}
            </p>

            <div className="flex gap-4 mt-2 items-center">
              <button
                onClick={() =>
                  decreasePoint(className)
                }
                className="px-4 py-2 bg-gray-200 rounded"
              >
                −
              </button>

              <p>{points[className]}</p>

              <button
                onClick={() =>
                  increasePoint(className)
                }
                className="px-4 py-2 bg-gray-200 rounded"
              >
                ＋
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold"
      >
        投票する
      </button>
    </main>
  );
}