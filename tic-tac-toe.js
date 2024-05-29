document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("gameBoard");
    const cells = document.getElementsByClassName("cell");
    const status = document.getElementById("status");

    let currentPlayer = "X";
    let gameActive = true;

    const gameBoard = ["", "", "", "", "", "", "", "", ""];

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                return gameBoard[a];
            }
        }

        if (!gameBoard.includes("")) {
            gameActive = false;
            return "tie";
        }

        return null;
    };

    const handleCellClick = (index) => {
        if (!gameActive || gameBoard[index] !== "") return;

        gameBoard[index] = currentPlayer;
        cells[index].innerText = currentPlayer;

        const winner = checkWin();
        if (winner) {
            status.innerText = winner === "tie" ? "It's a tie!" : `Player ${winner} wins!`;
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            status.innerText = `Player ${currentPlayer}'s turn`;
        }
    };

    const resetGame = () => {
        gameBoard.fill("");
        currentPlayer = "X";
        gameActive = true;
        status.innerText = `Player ${currentPlayer}'s turn`;
        for (let cell of cells) {
            cell.innerText = "";
        }
    };

    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => handleCellClick(i));
    }

    document.querySelector("button").addEventListener("click", resetGame);
    status.innerText = `Player ${currentPlayer}'s turn`;
});