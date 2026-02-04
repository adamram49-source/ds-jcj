import {
  ref,
  set,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const db = window.firebaseDB;

let gameCode = "";
let playerId = "";
let gameRef = null;

document.getElementById("createBtn").onclick = createGame;
document.getElementById("joinBtn").onclick = joinGame;

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function createGame() {
  gameCode = generateCode();
  playerId = "p1";

  gameRef = ref(db, "games/" + gameCode);

  await set(gameRef, {
    players: { p1: true },
    phase: "waiting"
  });

  document.getElementById("status").innerText =
    `קוד המשחק: ${gameCode}\nממתין לשחקן נוסף...`;

  listen();
}

async function joinGame() {
  const code = document.getElementById("codeInput").value.trim().toUpperCase();
  if (!code) return;

  gameCode = code;
  playerId = "p2";
  gameRef = ref(db, "games/" + gameCode);

  const snap = await get(gameRef);
  if (!snap.exists()) {
    alert("❌ קוד לא קיים");
    return;
  }

  await update(gameRef, {
    "players/p2": true,
    phase: "start"
  });

  listen();
}

function listen() {
  onValue(gameRef, snap => {
    const data = snap.val();
    if (!data) return;

    if (data.phase === "waiting") {
      document.getElementById("status").innerText =
        "ממתין לשחקן נוסף...";
    }

    if (data.phase === "start") {
      document.getElementById("status").innerText =
        "🎉 המשחק מתחיל!\nשני שחקנים מחוברים";
    }
  });
}
