const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = [];
let picks = [];
let currentRound = 1;
let maxRounds = 4;
let maxPlayers = 6;
let currentTurn = 0;
let snakeOrder = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  if (players.length < maxPlayers) {
    players.push(socket.id);
  }

  if (players.length === maxPlayers && snakeOrder.length === 0) {
    snakeOrder = [...players];
  }

  socket.emit("update", { picks, currentRound, snakeOrder, currentTurn });

  socket.on("makePick", (data) => {
    if (socket.id !== snakeOrder[currentTurn]) return;

    picks.push({
      player: socket.id,
      name: data.name,
      category: data.category,
      round: currentRound
    });

    if (currentRound <= maxRounds) {
      if (currentRound % 2 === 1) {
        currentTurn++;
        if (currentTurn >= snakeOrder.length) {
          currentTurn = snakeOrder.length - 1;
          currentRound++;
          snakeOrder.reverse();
        }
      } else {
        currentTurn--;
        if (currentTurn < 0) {
          currentTurn = 0;
          currentRound++;
          snakeOrder.reverse();
        }
      }
    }

    io.emit("update", { picks, currentRound, snakeOrder, currentTurn });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
