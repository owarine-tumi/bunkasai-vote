"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: 20 }}>
      <h1>管理者画面（学籍番号一括登録）</h1>

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
    </div>
  );
}