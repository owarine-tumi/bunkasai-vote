"use client";

import { useState } from "react";

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
      const res = await fetch("/api/admin/add-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "エラーが発生しました");
      } else {
        setMessage(`登録完了！ ${data.users.length}人追加`);
        setInput(""); // 入力リセット（お好み）
      }
    } catch (error) {
      setMessage("通信エラー");
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