// // This server code has been created with AI

// server/server.js
import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let expert = null;
const novices = new Set();

let lastText = "";
let lastState = null;
let lastModelUrl = "/models/Astronaut.glb";

function broadcastToNovices(payload) {
  const str = JSON.stringify(payload);
  for (const n of novices) {
    if (n.readyState === 1) n.send(str);
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (msg.type === "join") {
      ws.role = msg.role;

      if (msg.role === "expert") {
        expert = ws;
      } else {
        novices.add(ws);
      }

      ws.send(
        JSON.stringify({
          type: "joined",
          text: lastText,
          state: lastState,
          modelUrl: lastModelUrl,
        })
      );
      return;
    }

    // Only the expert can broadcast updates
    if (ws.role !== "expert") return;

    if (msg.type === "text") {
      lastText = msg.text ?? "";
      broadcastToNovices({ type: "text", text: lastText });
      return;
    }

    if (msg.type === "state") {
      lastState = msg;
      broadcastToNovices(msg);
      return;
    }

    if (msg.type === "model") {
      lastModelUrl = msg.url ?? lastModelUrl;
      broadcastToNovices({ type: "model", url: lastModelUrl });
      return;
    }
  });

  ws.on("close", () => {
    if (ws === expert) expert = null;
    novices.delete(ws);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});