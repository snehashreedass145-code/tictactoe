let playerScore = 0;
let computerScore = 0;
let streak = 0;
let lastPlayerMove = null;

/* ---------- SOUND SETUP ---------- */
const sounds = {
    click: new Audio("click.mp3"),
    win: new Audio("win.wav"),
    lose: new Audio("lose.wav"),
    tie: new Audio("tie.wav"),
    streak: new Audio("streak.wav")
};

sounds.click.volume = 0.5;
sounds.win.volume = 0.7;
sounds.lose.volume = 0.7;
sounds.tie.volume = 0.6;
sounds.streak.volume = 0.9;

/* ---------- Difficulty Logic ---------- */
function computerMove(difficulty) {
    const moves = ["rock", "paper", "scissors"];

    if (difficulty === "easy") {
        return moves[Math.floor(Math.random() * 3)];
    }

    if (difficulty === "normal") {
        return Math.random() < 0.5
            ? moves[Math.floor(Math.random() * 3)]
            : counterMove(lastPlayerMove);
    }

    if (difficulty === "hard") {
        return counterMove(lastPlayerMove);
    }
}

function counterMove(playerChoice) {
    if (!playerChoice)
        return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];

    if (playerChoice === "rock") return "paper";
    if (playerChoice === "paper") return "scissors";
    if (playerChoice === "scissors") return "rock";
}

/* ---------- Play Round ---------- */
function play(playerChoice) {
    sounds.click.play();

    lastPlayerMove = playerChoice;
    const difficulty = document.getElementById("difficulty-select").value;
    const computerChoice = computerMove(difficulty);

    let result = "";

    if (playerChoice === computerChoice) {
        result = "It's a Tie!";
        streak = 0;
        sounds.tie.play();
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        result = "You Win!";
        playerScore++;
        streak++;
        sounds.win.play();

        if (streak >= 2) sounds.streak.play();

        showWinAnimation("🎉");
    } else {
        result = "You Lose!";
        computerScore++;
        streak = 0;
        sounds.lose.play();
    }

    updateDisplay(result);
    saveToLeaderboard();
}

/* ---------- UI Update ---------- */
function updateDisplay(result) {
    document.getElementById("result").textContent = result;
    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("computer-score").textContent = computerScore;
    document.getElementById("streak").textContent = streak;
}

function showWinAnimation(symbol) {
    const anim = document.getElementById("winner-animation");
    anim.textContent = symbol;

    setTimeout(() => {
        anim.textContent = "";
    }, 700);
}

/* ---------- Leaderboard ---------- */
function saveToLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("rps_leaderboard")) || [];

    leaderboard.push(streak);
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("rps_leaderboard", JSON.stringify(leaderboard));
    showLeaderboard();
}

function showLeaderboard() {
    const list = document.getElementById("leaderboard");
    list.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("rps_leaderboard")) || [];

    data.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `Streak: ${score}`;
        list.appendChild(li);
    });
}

/* ---------- Theme Change ---------- */
document.getElementById("theme-select").addEventListener("change", (e) => {
    document.body.className = "";
    document.body.classList.add(e.target.value);
});

/* ---------- Buttons Events ---------- */
document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        play(btn.dataset.choice);
    });
});

/* Load leaderboard at start */
showLeaderboard();
