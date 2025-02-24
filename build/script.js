document.addEventListener("DOMContentLoaded", () => {
    const display = (() => {
        const renderMsg = (message) => {
            const msgElement = document.querySelector("#msg");
            msgElement.textContent = message;
            msgElement.classList.add("show");
        }
        const hideMsg = () => {
            const msgElement = document.querySelector("#msg");
            msgElement.classList.remove("show");
        }
        const showPlayersInput = () => {
          const playersInfo = document.querySelector("#PlayersInput")
          playersInfo.classList.remove("hidden")
        }
        const buttonsPlacementAdd = () => {
          const buttons = document.querySelector("#Buttons")
          buttons.classList.add("p-8")
        }
        const buttonsPlacementRemove = () => {
          const buttons = document.querySelector("#Buttons")
          buttons.classList.remove("p-8")
        }
        const hidePlayersInput = () => {
          const playersInfo = document.querySelector("#PlayersInput")
          playersInfo.classList.add("hidden")
        }
        const hideBoard = () => {
          const gameBoard = document.querySelector("#GameBoard")
          gameBoard.classList.add("hidden")
        }
        const showBoard = () => {
          const gameBoard = document.querySelector("#GameBoard")
          gameBoard.classList.remove("hidden")
        }
        return {
            renderMsg,
            hideMsg,
            showPlayersInput,
            hidePlayersInput,
            buttonsPlacementAdd,
            buttonsPlacementRemove,
            hideBoard,
            showBoard,
        }
    })()

    const gameBoard = (function () {
        let board = ["", "", "", "", "", "", "", "", ""]
        const render = () => {
            display.showBoard()
            let boardHTML = ""
            board.forEach((cell, index) => {
                boardHTML += `<div class="cell" id="cell-${index}">${cell}</div>`
            })
            document.querySelector("#GameBoard").innerHTML = boardHTML
            const cells = document.querySelectorAll(".cell")

            cells.forEach(cell => {
                cell.addEventListener("click", game.handleClick)
            })
        }
        const update = (index, value) => {
            board[index] = value
            render()
        }
        const getGameBoard = () => {
            return board
        }
        const reset = () => {
            board = ["", "", "", "", "", "", "", "", ""]
            display.hideMsg();
            render()
        }
        return {
            render,
            update,
            reset,
            getGameBoard
        }
    })()

    const createPlayer = (name, marker) => {
        return {
            name,
            marker
        }
    }

    const game = (() => {
        let players = []
        let currentPlayerIndex
        let gameOver

        const start = () => {
            players = [
                createPlayer(document.querySelector("#Player1").value, "X"),
                createPlayer(document.querySelector("#Player2").value, "O")
            ]
            currentPlayerIndex = 0
            gameOver = false
            display.hidePlayersInput()
            display.buttonsPlacementAdd()
            gameBoard.render()
        }

        const handleClick = (event) => {
            if (gameOver){
                return
            }
            let index = parseInt(event.target.id.split("-")[1])
            if(gameBoard.getGameBoard()[index] != ""){
                return
            }
            gameBoard.update(index, players[currentPlayerIndex].marker)

            if(checkForWin(gameBoard.getGameBoard(), players[currentPlayerIndex].marker)){
                gameOver = true
                display.renderMsg(`${players[currentPlayerIndex].name} won!`)
            } else if (checkForTie(gameBoard.getGameBoard())){
                gameOver = true
                display.renderMsg("It's a Tie!")
            }

            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0
        }

        return {
            start,
            handleClick
        }
    })()

    const startBtn = document.querySelector("#StartBtn")
    startBtn.addEventListener("click", () => {
      display.buttonsPlacementAdd()
        game.start()
        display.showBoard()
    })

    const resetBtn = document.querySelector("#ResetBtn")
    resetBtn.addEventListener("click", () => {
        display.showPlayersInput()
        gameBoard.reset()
        display.buttonsPlacementRemove()
        display.hideBoard()
    })

    function checkForWin(board, marker) {
        const winningStates = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        return winningStates.some(pattern => {
            return pattern.every(index => {
                return board[index] === marker
            })
        })
    }

    function checkForTie(board) {
        return board.every(cell => cell !== "")
    }
})

