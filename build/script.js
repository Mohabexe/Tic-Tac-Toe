document.addEventListener("DOMContentLoaded", () => {
  
    const display = (() => {
        const renderMsg = (message) =>{
            document.querySelector("#msg") = message
            document.querySelector("#msg").classList.remove("hidden")            
        } 
        return{
            renderMsg
        }

    })()
  
  const gameBoard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""]
    const render = () => {
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
    const update = (index,value) => {
        board[index] = value
        console.log(value)
        console.log(index)
        render()
    }
    const getGameBoard = () =>{
        return board
    }
    
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""]
        document.querySelector("#msg").innerHTML = ""
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
      marker,
      
    }
  }

  const game = (() => {
    let players = []
    let currentPlayerIndex
    let gameOver

    const start = () => {
      players = [
        createPlayer(document.querySelector("#Player1").value, "X"),
        createPlayer(document.querySelector("#Player2").value, "O"),
      ]
      currentPlayerIndex = 0
      gameOver = false
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
        gameBoard.update(index,players[currentPlayerIndex].marker)

        if(checkForWin(gameBoard.getGameBoard(), players[currentPlayerIndex].marker)){
            gameOver = true
            gameBoard.update(index,players[currentPlayerIndex].marker)

            display.renderMsg(`${players[currentPlayerIndex].name} won!`)
            
        }else if (checkForTie(gameBoard.getGameBoard())){
            gameOver = true
            display.renderMsg("It's a Tie!")
        }

        currentPlayerIndex = currentPlayerIndex ===0 ? 1 : 0

    }

    return {
      start,
      handleClick,
    }
  })()

  const startBtn = document.querySelector("#StartBtn")
  startBtn.addEventListener("click", () => {
    game.start()
  })
  const resetBtn = document.querySelector("#ResetBtn")
  resetBtn.addEventListener("click", () =>{
    gameBoard.reset()
  })
  function checkForWin(board){
    const winningStates = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    for(let i = 0 ; i < winningStates.length; i++){
        const [a,b,c] = winningStates[i]
        if(board[a] && board[a] == board[b] && board[a] == board[c]){
            return true
        }
    }
    return false
  }
  function checkForTie(board){
    return board.every(cell => cell !== "")
  }
})

