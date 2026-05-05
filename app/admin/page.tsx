"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const allClasses = [
  "1年1組","1年2組","1年3組","1年4組","1年5組","1年6組",
  "2年1組","2年2組","2年3組","2年4組","2年5組","2年6組",
  "3年1組","3年2組","3年3組","3年4組","3年5組","3年6組",
];

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState<any[]>([]);

  // 🔥 ランキング取得
  const fetchRanking = async () => {
    const snapshot = await getDocs(collection(db, "votes"));

    const totals: any = {};
    allClasses.forEach((c) => {
      totals[c] = 0;
    });

    snapshot.forEach((doc) => {
      const data = doc.data();
      const points = data.points;

      for (const className in points) {
        totals[className] += points[className];
      }
    });

    const sorted = Object.entries(totals)
      .map(([name, point]) => ({ name, point }))
      .sort((a: any, b: any) => b.point - a.point);

    setRanking(sorted);
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  // 🔥 学籍番号登録
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const studentIds = input
      .split("\n")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    try {
      for (const id of studentIds) {
        await setDoc(doc(db, "students", id), {
          voted: false,
        });
      }

      setMessage(`登録完了！ ${studentIds.length}人追加`);
      setInput("");
    } catch (error) {
      console.log(error);
      setMessage("エラーが発生しました");
    }

    setLoading(false);
  };

  // 🔥 全投票リセット
  const resetVotes = async () => {
    const ok = confirm("本当に全投票をリセットしますか？");
    if (!ok) return;

    try {
      // votes削除
      const voteSnapshot = await getDocs(collection(db, "votes"));
      for (const v of voteSnapshot.docs) {
        await deleteDoc(v.ref);
      }

      // studentsを未投票に戻す
      const studentSnapshot = await getDocs(collection(db, "students"));
      for (const s of studentSnapshot.docs) {
        await setDoc(s.ref, { voted: false }, { merge: true });
      }

      alert("リセット完了！");
      fetchRanking();
    } catch (error) {
      console.log(error);
      alert("リセット失敗");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>管理者画面</h1>

      {/* 学籍番号登録 */}
      <h2>学籍番号登録</h2>

      <textarea
        placeholder="学籍番号を1行ずつ入力"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        style={{ width: "300px" }}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "登録中..." : "一括登録"}
      </button>

      <p>{message}</p>

      <hr style={{ margin: "30px 0" }} />

      {/* 🔥 リセットボタン */}
      <button onClick={resetVotes} style={{ marginBottom: 20 }}>
        🔥 全投票リセット
      </button>

      {/* 🔥 ランキング */}
      <h2>投票ランキング</h2>

      <button onClick={fetchRanking}>更新</button>

      <ul>
        {ranking.map((item, index) => (
          <li key={item.name}>
            {index + 1}位：{item.name}（{item.point}ポイント）
          </li>
        ))}
      </ul>
    </div>
  );
}