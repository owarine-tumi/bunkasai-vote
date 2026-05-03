// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyASE1yhdbTYJrYsvlOkUhwz8l_LU6MEAas",
  authDomain: "bunkasai-vote.firebaseapp.com",
  projectId: "bunkasai-vote",
  storageBucket: "bunkasai-vote.firebasestorage.app",
  messagingSenderId: "441733460111",
  appId: "1:441733460111:web:f88e3c7ffbca93471640fa"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);

// Firestore を初期化して export
export const db = getFirestore(app);
