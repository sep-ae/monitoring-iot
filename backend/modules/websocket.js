import { WebSocketServer } from "ws";

let clients = [];

export function createWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter(c => c !== ws);
    });
  });
}

export function broadcast(obj) {
  const payload = JSON.stringify(obj);

  clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) ws.send(payload);
  });
}
