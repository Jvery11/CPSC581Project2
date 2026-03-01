// This server code has been created with AI


import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve ../public
app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { expert: null, novices: new Set(), lastText: "" });
  }
  return rooms.get(roomId);
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    let msg;
    try { msg = JSON.parse(data.toString()); }
    catch { return; }

    if (msg.type === "join") {
      ws.roomId = msg.roomId;
      ws.role = msg.role;

      const room = getRoom(msg.roomId);

      if (msg.role === "expert") room.expert = ws;
      else room.novices.add(ws);

      ws.send(JSON.stringify({
        type: "joined",
        text: room.lastText
      }));
      return;
    }

    if (msg.type === "text" && ws.role === "expert") {
      const room = getRoom(ws.roomId);
      room.lastText = msg.text;

      for (const n of room.novices) {
        if (n.readyState === 1) {
          n.send(JSON.stringify({ type: "text", text: msg.text }));
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});