// This code has been generated with AI

let ws = null;
let role = null;

const input = document.getElementById("input");
const mirror = document.getElementById("mirror");

function connect(selectedRole) {
  role = selectedRole;
  const roomId = document.getElementById("room").value;

const protocol = location.protocol === "https:" ? "wss" : "ws";
ws = new WebSocket(`${protocol}://${location.host}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "join",
      roomId,
      role
    }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "joined") {
      mirror.textContent = msg.text || "";
      input.disabled = role !== "expert";
    }

    if (msg.type === "text") {
      mirror.textContent = msg.text;
    }
  };
}

document.getElementById("expert").onclick = () => connect("expert");
document.getElementById("novice").onclick = () => connect("novice");

input.addEventListener("input", () => {
  if (role !== "expert" || !ws) return;

  ws.send(JSON.stringify({
    type: "text",
    text: input.value
  }));
});

input.disabled = true;