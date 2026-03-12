import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../white-board/src/entities/elements";
import { ServerElements } from "./elementStorage";

const serverElements = new ServerElements();

const app = express();
const PORT = 3000;

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("connected socket with id: ", socket.id);
    socket.on("board:sync-request", () => {
      socket.emit("board:full-sync", serverElements.getAllElements());
    });

    socket.on("board:drawing:client-send-element", (elem) => {
      console.log("recieve");
      if (!serverElements.hasElement(elem)) {
        socket.broadcast.emit("board:drawing:server-drawing-start", elem);
        console.log("send start");
      } else {
        socket.broadcast.emit("board:drawing:server-drawing-update", elem);
        console.log("send update");
      }
      serverElements.addElement(elem);
    });

    socket.on("board:drawing:client-stop-send-element", (elem) => {
      console.log("recieve end");
      socket.broadcast.emit("board:drawing:server-drawing-end", elem);
      serverElements.addElement(elem);
    });
  },
);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
