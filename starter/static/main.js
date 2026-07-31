const boardElement = document.getElementById("sudoku-board");
const messageElement = document.getElementById("message");

const difficultySelect = document.getElementById("difficulty");
const timerElement = document.getElementById("timer");

const hintButton = document.getElementById("hint-button");
const darkModeButton = document.getElementById("dark-mode-toggle");

let puzzle = [];
let solution = [];

let seconds = 0;
let timerInterval = null;
let hintsUsed = 0;

function startTimer() {
    clearInterval(timerInterval);

    seconds = 0;

    timerElement.textContent = "Time: 00:00";

    timerInterval = setInterval(() => {

        seconds++;

        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");

        timerElement.textContent = `Time: ${mins}:${secs}`;

    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

async function newGame() {

    const difficulty = difficultySelect.value;

    const response = await fetch(`/new?difficulty=${difficulty}`);

    const data = await response.json();

    puzzle = data.puzzle;
    solution = data.solution;

    renderBoard();

    messageElement.textContent = "";

    startTimer();
    hintsUsed = 0;
}

function renderBoard() {

    boardElement.innerHTML = "";

    for (let r = 0; r < 9; r++) {

        const row = document.createElement("div");
        row.className = "sudoku-row";

        for (let c = 0; c < 9; c++) {

            const input = document.createElement("input");

            input.className = "sudoku-cell";
            const block = Math.floor(r / 3) + Math.floor(c / 3);

            if (block % 2 === 0) {
              input.classList.add("block-light");
            } else {
              input.classList.add("block-dark");
            }

            input.maxLength = 1;

            input.dataset.row = r;
            input.dataset.col = c;

            if (puzzle[r][c] !== 0) {

                input.value = puzzle[r][c];

                input.disabled = true;

                input.classList.add("prefilled");

            } else {

                input.addEventListener("input", validateCell);

            }

            row.appendChild(input);

        }

        boardElement.appendChild(row);

    }

}

function validateCell(event) {

    const input = event.target;

    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    const value = parseInt(input.value);

    input.classList.remove("incorrect");
    input.classList.remove("correct");

    if (input.value === "") {

        return;

    }

    if (value === solution[row][col]) {

        input.classList.add("correct");

    } else {

        input.classList.add("incorrect");

    }

    checkCompletion();

}

async function checkSolution() {

    const board = [];

    document.querySelectorAll(".sudoku-row").forEach((row) => {

        const current = [];

        row.querySelectorAll("input").forEach((cell) => {

            current.push(Number(cell.value) || 0);

        });

        board.push(current);

    });

    const response = await fetch("/check", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            board: board

        })

    });

    const result = await response.json();

    if (result.correct) {

        stopTimer();

        messageElement.style.color = "green";

        messageElement.textContent = "Correct!";

        saveScore();

    } else {

    document.querySelectorAll(".sudoku-cell").forEach(cell => {
    cell.classList.remove("incorrect");
    cell.classList.remove("correct");
  });

    result.incorrect.forEach(([r, c]) => {

        const cell = document.querySelector(
            `.sudoku-cell[data-row="${r}"][data-col="${c}"]`
        );

        if (cell && !cell.disabled) {
            cell.classList.add("incorrect");
        }

    });

    messageElement.style.color = "red";
    messageElement.textContent = "Incorrect solution.";
  }

}

async function giveHint() {

    const response = await fetch("/hint");

    const data = await response.json();

    if (data.row === undefined)
        return;

    const selector =
        `.sudoku-cell[data-row="${data.row}"][data-col="${data.col}"]`;

    const cell = document.querySelector(selector);

    cell.value = data.value;

    cell.disabled = true;

    cell.classList.remove("incorrect");

    cell.classList.add("prefilled");
    hintsUsed++;

    checkCompletion();

}

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const enabled = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", enabled);

}

function checkCompletion() {

    const inputs = document.querySelectorAll(".sudoku-cell");

    for (const cell of inputs) {

        if (!cell.disabled && cell.value === "") {
            return;
        }

        if (cell.classList.contains("incorrect")) {
            return;
        }

    }

    stopTimer();

    messageElement.style.color = "green";
    messageElement.textContent = "🎉 Congratulations! Puzzle Solved!";

    saveScore();

}

function saveScore() {

    const difficulty = difficultySelect.value;

    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    const time = `${mins}:${secs}`;

    const name =
        prompt("Enter your name for the leaderboard:", "Player") || "Player";

    let scores =
        JSON.parse(localStorage.getItem("sudokuLeaderboard")) || [];

    scores.push({

    name,
    time,
    difficulty,
    hints: hintsUsed,
    seconds

});

    scores.sort((a, b) => a.seconds - b.seconds);

    scores = scores.slice(0, 10);

    localStorage.setItem(
        "sudokuLeaderboard",
        JSON.stringify(scores)
    );

    loadLeaderboard();

}

function loadLeaderboard() {

    const tbody =
        document.querySelector("#leaderboard tbody");

    tbody.innerHTML = "";

    const scores =
        JSON.parse(localStorage.getItem("sudokuLeaderboard")) || [];

    scores.forEach((score, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${score.name}</td>

            <td>${score.time}</td>

            <td>${score.difficulty}</td>
            
            <td>${score.hints ?? 0}</td>

        `;

        tbody.appendChild(row);

    });

}

document
    .getElementById("new-game")
    .addEventListener("click", newGame);
difficultySelect.addEventListener("change", newGame);

document
    .getElementById("check-solution")
    .addEventListener("click", checkSolution);

hintButton.addEventListener("click", giveHint);

darkModeButton.addEventListener("click", toggleDarkMode);

window.addEventListener("load", () => {

    if (localStorage.getItem("darkMode") === "true") {

        document.body.classList.add("dark-mode");

    }

    loadLeaderboard();

    newGame();

});