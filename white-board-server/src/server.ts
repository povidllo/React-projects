import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../white-board/src/entities/elements";
import { ServerElements } from "./elementStorage";

const serverElements = new ServerElements();
const boards = new Map<string, ServerElements>();

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

    const roomId = socket.handshake.auth.roomId;
    socket.join(roomId);
    if (!boards.has(roomId)) {
      boards.set(roomId, new ServerElements());
    }

    const board = boards.get(roomId)!;

    socket.on("board:sync-request", () => {
      socket.emit("board:full-sync", board.getAllElements());
    });

    socket.on("board:drawing:client-send-element", (elem) => {
      console.log("recieve");
      if (!board.hasElement(elem)) {
        socket.to(roomId).emit("board:drawing:server-drawing-start", elem);
        console.log("send start");
      } else {
        socket.to(roomId).emit("board:drawing:server-drawing-update", elem);
        console.log("send update");
      }
      board.addElement(elem);
    });

    socket.on("board:drawing:client-stop-send-element", (elem) => {
      console.log("recieve end");
      socket.to(roomId).emit("board:drawing:server-drawing-end", elem);
      board.addElement(elem);
    });

    socket.on("board:moving:client-start-send-element", (elem) => {
      console.log("moving start", elem.x, elem.y);
      socket.to(roomId).emit("board:moving:server-moving-start", elem);
      board.setMovingCoordinates(elem.id, elem.x, elem.y);
    });
    socket.on("board:moving:client-update-send-element", (elem) => {
      console.log("moving update", elem.x, elem.y);
      socket.to(roomId).emit("board:moving:server-moving-update", elem);
      board.setMovingCoordinates(elem.id, elem.x, elem.y);
    });
    socket.on("board:moving:client-end-send-element", (elem) => {
      console.log("moving end", elem.x, elem.y);
      socket.to(roomId).emit("board:moving:server-moving-end", elem);
      board.setMovingCoordinates(elem.id, elem.x, elem.y);
    });
  },
);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
