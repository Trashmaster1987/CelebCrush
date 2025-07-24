const socket = io();
const picksDiv = document.getElementById("picks");
const statusDiv = document.getElementById("status");

document.getElementById("submit").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  if (name && category) {
    socket.emit("makePick", { name, category });
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
  }
});

socket.on("update", (data) => {
  // Display picks
  picksDiv.innerHTML = "";
  data.picks.forEach((p) => {
    const div = document.createElement("div");
    div.textContent = `[Round ${p.round}] ${p.name} - (${p.category})`;
    picksDiv.appendChild(div);
  });

  // Show turn/round
  if (data.currentRound > 4) {
    statusDiv.textContent = "Draft Complete!";
  } else {
    const turnPlayer = data.snakeOrder[data.currentTurn];
    statusDiv.textContent = `Round ${data.currentRound} - Waiting for: ${turnPlayer}`;
  }
});
