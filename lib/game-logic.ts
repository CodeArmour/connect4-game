import { ROWS, COLUMNS, EMPTY, PLAYER, AI, Difficulty } from "./constants"

// Make a move on the board
export function makeMove(board: number[][], column: number, player: number): number[][] | null {
  // Create a deep copy of the board
  const newBoard = board.map((row) => [...row])

  // Find the lowest empty row in the selected column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][column] === EMPTY) {
      newBoard[row][column] = player
      return newBoard
    }
  }

  // Column is full
  return null
}

// Check if there's a winner
export function checkWinner(board: number[][]): number | null {
  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      const cell = board[row][col]
      if (
        cell !== EMPTY &&
        cell === board[row][col + 1] &&
        cell === board[row][col + 2] &&
        cell === board[row][col + 3]
      ) {
        return cell
      }
    }
  }

  // Check vertical
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const cell = board[row][col]
      if (
        cell !== EMPTY &&
        cell === board[row + 1][col] &&
        cell === board[row + 2][col] &&
        cell === board[row + 3][col]
      ) {
        return cell
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      const cell = board[row][col]
      if (
        cell !== EMPTY &&
        cell === board[row + 1][col + 1] &&
        cell === board[row + 2][col + 2] &&
        cell === board[row + 3][col + 3]
      ) {
        return cell
      }
    }
  }

  // Check diagonal (up-right)
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      const cell = board[row][col]
      if (
        cell !== EMPTY &&
        cell === board[row - 1][col + 1] &&
        cell === board[row - 2][col + 2] &&
        cell === board[row - 3][col + 3]
      ) {
        return cell
      }
    }
  }

  return null
}

// Evaluate the board state for the AI
function evaluateBoard(board: number[][]): number {
  const winner = checkWinner(board)

  if (winner === AI) return 1000
  if (winner === PLAYER) return -1000

  // Heuristic evaluation
  let score = 0

  // Check horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      score += evaluateWindow([board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]])
    }
  }

  // Check vertical windows
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      score += evaluateWindow([board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]])
    }
  }

  // Check diagonal (down-right) windows
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      score += evaluateWindow([
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ])
    }
  }

  // Check diagonal (up-right) windows
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      score += evaluateWindow([
        board[row][col],
        board[row - 1][col + 1],
        board[row - 2][col + 2],
        board[row - 3][col + 3],
      ])
    }
  }

  return score
}

// Evaluate a window of 4 cells
function evaluateWindow(window: number[]): number {
  let score = 0
  const aiCount = window.filter((cell) => cell === AI).length
  const playerCount = window.filter((cell) => cell === PLAYER).length
  const emptyCount = window.filter((cell) => cell === EMPTY).length

  if (aiCount === 4) score += 100
  else if (aiCount === 3 && emptyCount === 1) score += 5
  else if (aiCount === 2 && emptyCount === 2) score += 2

  if (playerCount === 3 && emptyCount === 1) score -= 4

  return score
}

// Check if the board is full
function isBoardFull(board: number[][]): boolean {
  return board[0].every((cell) => cell !== EMPTY)
}

// Minimax algorithm with alpha-beta pruning
function minimax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  const winner = checkWinner(board)

  // Terminal states
  if (winner === AI) return 1000
  if (winner === PLAYER) return -1000
  if (isBoardFull(board) || depth === 0) return evaluateBoard(board)

  if (isMaximizing) {
    let maxEval = Number.NEGATIVE_INFINITY

    // Try each column
    for (let col = 0; col < COLUMNS; col++) {
      const newBoard = makeMove(board, col, AI)
      if (newBoard) {
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false)
        maxEval = Math.max(maxEval, evaluation)
        alpha = Math.max(alpha, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }
    }

    return maxEval
  } else {
    let minEval = Number.POSITIVE_INFINITY

    // Try each column
    for (let col = 0; col < COLUMNS; col++) {
      const newBoard = makeMove(board, col, PLAYER)
      if (newBoard) {
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true)
        minEval = Math.min(minEval, evaluation)
        beta = Math.min(beta, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }
    }

    return minEval
  }
}

// Get the best move for the AI
export function getAIMove(board: number[][], difficulty: Difficulty): number {
  let bestScore = Number.NEGATIVE_INFINITY
  let bestColumn = -1

  // Randomize the order of columns to try
  const columns = Array.from({ length: COLUMNS }, (_, i) => i)
  for (let i = columns.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[columns[i], columns[j]] = [columns[j], columns[i]]
  }

  // For easy difficulty, occasionally make a random move
  if (difficulty === Difficulty.EASY && Math.random() < 0.4) {
    const validColumns = columns.filter((col) => board[0][col] === EMPTY)
    if (validColumns.length > 0) {
      return validColumns[Math.floor(Math.random() * validColumns.length)]
    }
  }

  // Try each column
  for (const col of columns) {
    if (board[0][col] === EMPTY) {
      // Check if column is not full
      const newBoard = makeMove(board, col, AI)
      if (newBoard) {
        // Use different depths based on difficulty
        const score = minimax(newBoard, difficulty, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false)

        if (score > bestScore) {
          bestScore = score
          bestColumn = col
        }
      }
    }
  }

  return bestColumn
}

