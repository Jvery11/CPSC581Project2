// This code has been generated with AI

let ws = null;
let role = null;

// Overlay DOM
const overlay = document.getElementById("sessionOverlay");
const expertView = document.getElementById("expertView");
const noviceView = document.getElementById("noviceView");

const endSessionBtn = document.getElementById("endSession");
const endSessionNoviceBtn = document.getElementById("endSession_novice");

function showOverlay(whichRole) {
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  if (whichRole === "expert") {
    expertView.classList.remove("hidden");
    noviceView.classList.add("hidden");
  } else {
    noviceView.classList.remove("hidden");
    expertView.classList.add("hidden");
  }
}

function hideOverlay() {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  expertView.classList.add("hidden");
  noviceView.classList.add("hidden");
}

// End buttons
endSessionBtn?.addEventListener("click", () => hideOverlay());
endSessionNoviceBtn?.addEventListener("click", () => hideOverlay());

function connect(selectedRole) {
  role = selectedRole;

  // If you don’t have a room input, just hardcode:
  const roomEl = document.getElementById("room");
  const roomId = roomEl ? roomEl.value : "default";

  showOverlay(role);

  // Connect WS
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${protocol}://${location.host}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", roomId, role }));

    // Tell gestures.js what role we are + give it ws
    window.__APP_ROLE__ = role;
    window.__APP_WS__ = ws;

    // Notify gestures.js that we joined
    window.dispatchEvent(new Event("app:joined"));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    // Forward everything to gestures.js (expert sends state, novice receives state)
    window.dispatchEvent(new CustomEvent("app:ws", { detail: msg }));
  };
}

document.getElementById("expert").onclick = () => connect("expert");
document.getElementById("novice").onclick = () => connect("novice");